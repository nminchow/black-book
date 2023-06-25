import { ClientAndCommands, dbWrapper } from "../bot";
import hellTide from "../views/hellTide";
import worldBoss from "../views/worldBoss";
import zoneEvent from "../views/zoneEvent";
import { TextBasedChannel } from "discord.js";
import { Database } from "../types/supabase";
import { RawEventResponse, getEvents } from "../utility/getEvents";
import { createImage } from "../utility/createImage";
import { helltideUpdateCheck } from "../utility/helltideUpdateCheck";

export enum EventType {
  WorldBoss = 'worldBoss',
  ZoneEvent = 'zoneEvent',
  Helltide = 'helltide',
}

export type EventResponse = Pick<EventParams, 'name' | 'location' | 'time'>

export type EventParams = {
  name: string,
  time: number,
  location: string,
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
    .filter('time', 'lt', new Date().toISOString());

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
    const {error: insertionError} = await db
      .from('events')
      .insert([
        {
          name: event.name,
          time: new Date(event.time).toISOString(),
          location: event.location,
          type: event.type,
        },
      ])
      .select();

  if (insertionError) {
    console.error('event insertion error');
    console.error(insertionError);
    return false;
  }
  return true;
};

type mapping = {
  [key: string]: string;
}

const hellTideMapping = {
  'kehj': 'Kehjistan',
  'hawe': 'Hawezar',
  'scos': 'Scosglen',
  'frac': 'Fractured Peaks',
  'step': 'Dry Steppes',
} as mapping;

const helltideNotify = async (client: ClientAndCommands, db: NonNullable<dbWrapper>, helltide: RawEventResponse['helltide']) => {
  const startTime = helltide.timestamp * 1000;

  if (startTime + 120000 > new Date().getTime()) {
    console.log('helltide started less than two minutes ago, skipping processing');
    return;
  }

  const event = {
    time: startTime + 3600000,
    location: hellTideMapping[helltide.zone] || 'Sanctuary',
    type: EventType.Helltide,
    name: 'The Helltide Rises',
  };

  const createImageWrapper = async () => {
    try {
      return { imagePath: await createImage(db) };
    } catch (error) {
      console.error('error creating image');
      console.error(error);
      return null
    }
  }

  return scanAndNotifyForEvent(client, db, event, createImageWrapper);
};

const zoneEventNotify = async (client: ClientAndCommands, db: NonNullable<dbWrapper>, zoneEvent: RawEventResponse['legion']) => {
  const event = {
    time: zoneEvent.timestamp * 1000,
    location: `${zoneEvent.territory}, ${zoneEvent.zone}`,
    type: EventType.ZoneEvent,
    name: 'The Gathering Legions assemble',
  };
  return scanAndNotifyForEvent(client, db, event);
};

const bossNotify = (client: ClientAndCommands, db: NonNullable<dbWrapper>, boss: RawEventResponse['boss']) => {
  const event = {
    time: boss.timestamp * 1000,
    location: `${boss.territory}, ${boss.zone}`,
    type: EventType.WorldBoss,
    name: boss.name,
  };
  return scanAndNotifyForEvent(client, db, event);
};

const scanAndNotifyForEvent = async (
  client: ClientAndCommands,
  db: NonNullable<dbWrapper>,
  event: EventParams,
  beforeNotify: () => Promise<NotificationMetadata | null> = async () => ({ imagePath: '' })
) => {
  const { time, type } = event;
  const timeCheck = new Date(time);
  if (timeCheck < new Date()) return;
  const existing = await checkForExisting(type, db, time);
  if (existing) return;
  const insertion = await insertEvent(event, db);
  if (!insertion) return;
  const metadata = await beforeNotify();
  if (metadata == null) return;
  sendNotifications(event, client, db, metadata);
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


export type SubRecord = Database['public']['Tables']['subscriptions']['Row'];

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

const attemptToSendMessage = async (channel: TextBasedChannel, event: EventParams, sub: SubRecord, metadata: NotificationMetadata) => {
  const eventView = getView(event.type);
  try {
    return await channel.send({ embeds: eventView(event, metadata, sub), content: mentionContent(event.type, sub) });
  } catch (error) {
    console.error(`Error sending event to ${JSON.stringify(sub)}`);
    console.error(error);
  }
  return null;
};

export type NotificationMetadata = {
  imagePath: string,
}

const sendNotifications = async (event: EventParams, client: ClientAndCommands, db: NonNullable<dbWrapper>, metadata: NotificationMetadata) => {
  const { data } = await db.from('subscriptions').select().filter(event.type.toLowerCase(), 'eq', true);
  data?.map(async sub => {
    const { channel_id: channelId } = sub;
    const channel = client.channels.cache.get(channelId);
    if (!channel || !channel.isTextBased()) return;

    const message = await attemptToSendMessage(channel, event, sub, metadata);

    if (!message) return;

    const { error: insertionError } = await db
      .from('notifications')
      .insert([
        {
          channel_id: channelId,
          flagged_for_deletion: sub.auto_delete,
          time: new Date(event.time).toISOString(),
          message_id: message.id,
        }
      ]);
    if (insertionError) {
      console.error('error inserting notificaiton record');
      console.error(insertionError);
    }
  });
};
