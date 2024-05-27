import { ClientAndCommands } from "../bot";
import { dbWrapper } from '../utility/database';
import hellTide from "../views/hellTide";
import worldBoss from "../views/worldBoss";
import zoneEvent from "../views/zoneEvent";
import { Locale, TextBasedChannel } from "discord.js";
import { Database } from "../types/supabase";
import { RawEventResponse, getEvents } from "../utility/getEvents";
import { createImage, createImageMetadata } from "../utility/createImage";
import { helltideUpdateCheck } from "../utility/helltideUpdateCheck";
import { toErrorWithMessage } from "../utility/errorHelper";
import { Locales } from "../i18n/i18n-types";
import { parseLocaleString } from "../i18n/type-transformer";
import updatePanels from "../utility/updatePanels";

export enum EventType {
  WorldBoss = 'worldBoss',
  ZoneEvent = 'zoneEvent',
  Helltide = 'helltide',
}

export type EventResponse = Pick<EventParams, 'name' | 'location' | 'time'>

export type EventParams = {
  name: string,
  time: number,
  location: {
    zone: string,
    territory: string | null,
  },
  type: EventType,
}

export const createListener = (client: ClientAndCommands, db: dbWrapper) => {
  if (!db) return;
  queryForUpdates(client, db);
  setInterval(() => queryForUpdates(client, db), 60000);
};

const queryForUpdates = (client: ClientAndCommands, db: NonNullable<dbWrapper>) => {
  console.log('doing event checks');
  deleteOldMessages(client, db);
  checkForEvents(client, db);
}

const deleteOldMessages = async (client: ClientAndCommands, db: NonNullable<dbWrapper>) => {
  const { data } = await db.from('notifications')
    .select()
    .filter('flagged_for_deletion', 'eq', true)
    .filter('deleted', 'eq', false)
    .filter('time', 'lt', new Date().toISOString())
    .limit(500);

  if (!data) return;

  data?.map(async ({ channel_id, message_id }) => {
    const channel = client.channels.cache.get(channel_id);
    if(!channel?.isTextBased()) return;
    try {
      await channel.messages.delete(message_id);
    } catch (error) {
      console.error(`unable to delete message ${message_id}`);
      console.error(error);
    }

  });

  const { error: updateError } = await db.from('notifications')
    .update({ deleted: true })
    .filter('id', 'in', `(${data.map(x => x.id)})`);

  if (updateError) {
    console.error('error updating deletion rows');
    console.error(updateError);
  }
}

const checkForExisting = async (eventType: EventType, db: NonNullable<dbWrapper>, timeAsNumber: number) => {
  const time = new Date(Number(timeAsNumber)).toISOString();

  const threeBefore = new Date(timeAsNumber - 180000).toISOString();
  const threeAfter = new Date(timeAsNumber + 180000).toISOString();

  const { data } = await db.from('events')
    .select()
    .limit(1)
    .filter('type', 'eq', eventType)
    .filter('time', 'gt', threeBefore)
    .filter('time', 'lt', threeAfter);

    if (data && data[0]) {
      const truncatedTime = time.slice(0, time.length-5);
      if (truncatedTime === data[0].time) return true;
      console.info('hit non-identical existing records:')
      console.info(`db:  ${data[0].time} - ${data[0].type} - ${data[0].name} - ${data[0].id}`);
      console.info(`api: ${truncatedTime} - ${eventType}`);
      return true;
    }

    return false;
};

const insertEvent = async (event: EventParams, db: NonNullable<dbWrapper>) => {
    const { data, error: insertionError} = await db
      .from('events')
      .insert([
        {
          name: event.name,
          time: new Date(event.time).toISOString(),
          location: `${event.location.zone}${event.location.territory ? ` ${event.location.territory}` : ''}`,
          type: event.type,
        },
      ])
      .select();

  if (insertionError) {
    console.error('event insertion error');
    console.error(insertionError);
    return null;
  }
  return data[0];
};

type mapping = {
  [key: string]: string;
}

const helltideNotify = async (client: ClientAndCommands, db: NonNullable<dbWrapper>, helltide: RawEventResponse['helltide']) => {
  const startTime = helltide.timestamp * 1000;

  if (startTime + 120000 > new Date().getTime()) {
    console.log('helltide started less than two minutes ago, skipping processing');
    return;
  }

  const event = {
    time: startTime + 3600000,
    location: { zone: helltide.zone, territory: null },//hellTideMapping[helltide.zone] || 'Sanctuary',
    type: EventType.Helltide,
    name: 'The Helltide Rises', // written to db, but not used for view
  };

  const createImageWrapper = async () => await createImageMetadata(db, false);

  return scanAndNotifyForEvent(client, db, event, createImageWrapper);
};

const zoneEventNotify = async (client: ClientAndCommands, db: NonNullable<dbWrapper>, zoneEvent: RawEventResponse['legion']) => {
  const event = {
    time: zoneEvent.timestamp * 1000,
    location: { zone: zoneEvent.zone, territory: zoneEvent.territory },  //`${zoneEvent.territory}, ${zoneEvent.zone}`,
    type: EventType.ZoneEvent,
    name: 'The Gathering Legions assemble', // written to db, but not used for view
  };
  return scanAndNotifyForEvent(client, db, event);
};

const bossNotify = (client: ClientAndCommands, db: NonNullable<dbWrapper>, boss: RawEventResponse['boss']) => {
  const event = {
    time: boss.timestamp * 1000,
    location: { zone: boss.zone, territory: boss.territory },
    type: EventType.WorldBoss,
    name: boss.name,
  };
  return scanAndNotifyForEvent(client, db, event);
};

const scanAndNotifyForEvent = async (
  client: ClientAndCommands,
  db: NonNullable<dbWrapper>,
  event: EventParams,
  beforeNotify: () => Promise<NotificationMetadata | null> = async () => ({ imagePath: null, isUpdated: false })
) => {
  const { time, type } = event;
  const timeCheck = new Date(time);
  if (timeCheck < new Date()) return;
  const existing = await checkForExisting(type, db, time);
  if (existing) return;
  const row = await insertEvent(event, db);
  if (!row) return;
  const metadata = await beforeNotify();
  if (metadata == null) return;
  sendNotifications(event, row, client, db, metadata);
  setTimeout(() => updatePanels(client, db), Number.parseInt(process.env.PANEL_DELAY || '0', 10));
}

const checkForEvents = async (client: ClientAndCommands, db: NonNullable<dbWrapper>) => {
  const event = await getEvents();
  if (!event) {
    return;
  }
  helltideUpdateCheck(client, db);
  bossNotify(client, db, event.boss);
  helltideNotify(client, db, event.helltide);
  zoneEventNotify(client, db, event.legion);
};

const getView = (eventType: EventType) => {
  if (eventType === EventType.Helltide) {
    return hellTide;
  }
  if (eventType === EventType.WorldBoss) {
    return worldBoss;
  }
  return zoneEvent;
}


export type SubRecord = Database['public']['Tables']['subscriptions']['Row'] & { locale: Locales }
export type EventRecord = Database['public']['Tables']['events']['Row'];

const mentionRole = (eventType: EventType, sub: SubRecord) => {
  if (eventType === EventType.Helltide) {
    return sub.helltide_role;
  }
  if (eventType === EventType.WorldBoss) {
    return sub.boss_role;
  }
  return sub.event_role;
}

const mentionContent = (eventType: EventType, sub: SubRecord) => {
  const typeRole = mentionRole(eventType, sub);
  const { role } = sub;

  if (typeRole && role) {
    return `${role} - ${typeRole}`;
  }

  return typeRole || role || undefined;
};

const expectedErrors = [
  'Missing Access',
  'Missing Permissions'
];

const attemptToSendMessage = async (channel: TextBasedChannel, event: EventParams, sub: SubRecord, metadata: NotificationMetadata, db: NonNullable<dbWrapper>) => {
  const eventView = getView(event.type);
  try {
    return await channel.send({ embeds: eventView(event, metadata, sub), content: mentionContent(event.type, sub) });
  } catch (error) {
    const errorWithMessage = toErrorWithMessage(error);
    if(expectedErrors.some(x => errorWithMessage.message === x)) {
      console.error(`no channel access: ${sub.channel_id}`);
      await disableSubById(sub.id, db);
    } else {
      console.error(`Error sending event to ${JSON.stringify(sub)}`);
      console.error(error);
    }
  }
  return null;
};

export type NotificationMetadata = {
  imagePath: string | null,
  isUpdated: boolean,
}

// just doing this join in memory, for now. Reevalute if non-us count grows
export const getLocales = async (db: NonNullable<dbWrapper>) => {
  const { data, error } = await db.from('guilds').select('guild_id, locale')
    .filter('locale', 'not.eq', Locale.EnglishUS)
    .filter('locale', 'not.eq', Locale.EnglishGB);
  if (error) {
    throw 'error fetching locales';
  }
  return data.reduce((acc, { guild_id, locale }) => ({
    ...acc,
    [guild_id]: locale
  }), {} as mapping);
};

const disableSubById = async (id: number, db: NonNullable<dbWrapper>) => {
  const { error } = await db.from('subscriptions').update({ disabled: true }).filter('id', 'eq', id);
  if (error) {
    console.error('error disabling sub');
    console.error(error);
  }
}

const sendNotifications = async (event: EventParams, row: EventRecord, client: ClientAndCommands, db: NonNullable<dbWrapper>, metadata: NotificationMetadata) => {
  const { data } = await db.from('subscriptions').select()
    .filter(event.type.toLowerCase(), 'eq', true)
    .filter('disabled', 'eq', false);
  const localeMap = await getLocales(db);
  data?.map(async sub => {
    const { channel_id: channelId, id } = sub;
    const channel = client.channels.cache.get(channelId);

    if (!channel || !channel.isTextBased()) {
      console.log(`disabling sub ${id} with missing channel ${channelId}`);
      await disableSubById(id, db);
      return;
    }

    const locale = parseLocaleString(localeMap[sub.guild_id]);

    const message = await attemptToSendMessage(channel, event, { locale, ...sub }, metadata, db);

    if (!message) return;

    const { error: insertionError } = await db
      .from('notifications')
      .insert([
        {
          channel_id: channelId,
          flagged_for_deletion: sub.auto_delete,
          time: new Date(event.time).toISOString(),
          message_id: message.id,
          event: row.id,
          locale: localeMap[sub.guild_id] || Locale.EnglishUS,
        }
      ]);
    if (insertionError) {
      console.error('error inserting notificaiton record');
      console.error(insertionError);
    }
  });
};
