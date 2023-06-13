import { ClientAndCommands, dbWrapper } from "../bot";
import fetch from 'node-fetch';
import hellTide from "../views/hellTide";
import worldBoss from "../views/worldBoss";
import zoneEvent from "../views/zoneEvent";

export const createListener = (client: ClientAndCommands, db: dbWrapper) => {
  if (!db) return;
  queryForUpdates(client, db);
  setInterval(() => queryForUpdates(client, db), 60000);
};

enum EventType {
  WorldBoss = 'worldBoss',
  ZoneEvent = 'zoneEvent',
  Helltide = 'helltide',
}

type Response = {
  event: EventResponse
}

export type EventResponse = {
  name: string,
  location: string,
  time: number,
}

const queryForUpdates = (client: ClientAndCommands, db: NonNullable<dbWrapper>) => {
  console.log('doing event checks');
  checkForType(EventType.WorldBoss, client, db);
  checkForType(EventType.ZoneEvent, client, db);
  checkForType(EventType.Helltide, client, db);
}
const checkForType = async (eventType: string, client: ClientAndCommands, db: NonNullable<dbWrapper>) => {
  const response = await fetch(`https://diablo4.life/api/trackers/${eventType}/list`);
  const { event } = await response.json() as Response;
  if (Object.keys(event).length === 0) return;
  const { name, time: rawTime, location } = event as EventResponse;

  const time = new Date(rawTime).toISOString();

  const { data } = await db.from('events')
    .select()
    .limit(1)
    .filter('type', 'eq', eventType)
    .filter('time', 'eq', time);

  if (data && data[0]) return;

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

  sendNotifications(eventType as EventType, event, client, db);
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

const sendNotifications = async (eventType: EventType, event: EventResponse, client: ClientAndCommands, db: NonNullable<dbWrapper>) => {
  const { data } = await db.from('subscriptions').select().filter(eventType, 'eq', true);
  data?.map(sub => {
    const { channel_id: channelId, role } = sub;
    const channel = client.channels.cache.get(channelId);
    if (!channel || !channel.isTextBased()) return;
    const eventView = getView(eventType);
    channel.send({embeds: [eventView(event)]});
  });

};