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
  event: RawEventResponse
}

type ConfidenceObject = {
  [key: string]: number
}

export type EventResponse = Pick<RawEventResponse, 'name' | 'location' | 'time'>

type RawEventResponse = {
  name: string,
  location: string,
  time: number,
  confidence: {
    name: ConfidenceObject,
    location: ConfidenceObject,
    time: ConfidenceObject,
  }
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
  const { name, time: rawTime, location, confidence: { time: timeCheck } } = event;

  if (!Object.values(timeCheck).some(x => x > 0.55)) return;
  if (!name || !rawTime) return;

  const time = new Date(Number(rawTime)).toISOString();

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

  sendNotifications(eventType as EventType, { name, time: Number(rawTime), location }, client, db);
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

export type SubRecord = {
  boss_role: string | null;
  channel_id: string;
  created_at: string | null;
  event_role: string | null;
  guild_id: string;
  helltide: boolean;
  helltide_role: string | null;
  id: number;
  role: string | null;
  worldboss: boolean;
  zoneevent: boolean;
};

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

const sendNotifications = async (eventType: EventType, event: EventResponse, client: ClientAndCommands, db: NonNullable<dbWrapper>) => {
  const { data } = await db.from('subscriptions').select().filter(eventType.toLowerCase(), 'eq', true);
  data?.map(async sub => {
    const { channel_id: channelId } = sub;
    const channel = client.channels.cache.get(channelId);
    if (!channel || !channel.isTextBased()) return;
    const eventView = getView(eventType);
    try {
      await channel.send({embeds: [eventView(event)], content: mentionContent(eventType, sub)});
    } catch (error) {
      console.error(`Error sending event to ${JSON.stringify(sub)}`);
      console.error(error);
    }
  });
};