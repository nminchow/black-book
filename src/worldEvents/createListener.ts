import { ClientAndCommands, dbWrapper } from "../bot";
import fetch from 'node-fetch';
import hellTide from "../views/hellTide";
import worldBoss from "../views/worldBoss";
import zoneEvent from "../views/zoneEvent";
import { TextBasedChannel } from "discord.js";
import { Database } from "../types/supabase";
import { RawEventResponse, getEvents } from "../utility/getEvents";

export enum EventType {
  WorldBoss = 'worldBoss',
  ZoneEvent = 'zoneEvent',
  Helltide = 'helltide',
}

export type EventResponse = Pick<RawEventResponse, 'name' | 'location' | 'time'>

export const createListener = (client: ClientAndCommands, db: dbWrapper) => {
  if (!db) return;
  queryForUpdates(client, db);
  setInterval(() => queryForUpdates(client, db), 60000);
};

const queryForUpdates = (client: ClientAndCommands, db: NonNullable<dbWrapper>) => {
  console.log('doing event checks');
  deleteOldMessages(client, db);
  checkForType(EventType.WorldBoss, client, db);
  checkForType(EventType.ZoneEvent, client, db);
  checkForType(EventType.Helltide, client, db);
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

const checkForType = async (eventType: string, client: ClientAndCommands, db: NonNullable<dbWrapper>) => {
  const event = await getEvents(eventType);
  if (Object.keys(event).length === 0) return;
  const { name, time: rawTime, location, confidence: { time: timeCheck } } = event;

  if (!Object.values(timeCheck).some(x => x > 0.55)) return;
  if (!name || !rawTime) return;

  const timeAsNumber = Number(rawTime);

  const time = new Date(timeAsNumber).toISOString();

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
    if (truncatedTime === data[0].time) return;
    console.info('hit non-identical existing records:')
    console.info(`db:  ${data[0].time} - ${data[0].type} - ${data[0].name} - ${data[0].id}`);
    console.info(`api: ${truncatedTime} - ${eventType} - ${name}`);
    return;
  }

  const {error: insertionError} = await db
    .from('events')
    .insert([
      {
        name,
        time,
        location,
        type: eventType,
      },
    ])
    .select();

  if (insertionError) {
    console.error('event insertion error');
    console.error(insertionError);
    return;
  }

  sendNotifications(eventType as EventType, { name, time: timeAsNumber, location }, client, db);
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

const attemptToSendMessage = async (channel: TextBasedChannel, event: EventResponse, eventType: EventType, sub: SubRecord) => {
  const eventView = getView(eventType);
  try {
    return await channel.send({ embeds: [eventView(event)], content: mentionContent(eventType, sub) });
  } catch (error) {
    console.error(`Error sending event to ${JSON.stringify(sub)}`);
    console.error(error);
  }
  return null;
}

const sendNotifications = async (eventType: EventType, event: EventResponse, client: ClientAndCommands, db: NonNullable<dbWrapper>) => {
  const { data } = await db.from('subscriptions').select().filter(eventType.toLowerCase(), 'eq', true);
  data?.map(async sub => {
    const { channel_id: channelId } = sub;
    const channel = client.channels.cache.get(channelId);
    if (!channel || !channel.isTextBased()) return;

    const message = await attemptToSendMessage(channel, event, eventType, sub);

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
