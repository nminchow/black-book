import { ClientAndCommands, dbWrapper } from "../bot";
import fetch from 'node-fetch';
import hellTide from "../views/hellTide";
import worldBoss from "../views/worldBoss";
import zoneEvent from "../views/zoneEvent";
import { TextBasedChannel } from "discord.js";
import { Database } from "../types/supabase";

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
  deleteOldMessages(client, db);
  // checkForType(EventType.WorldBoss, client, db);
  checkForType(EventType.ZoneEvent, client, db);
  // checkForType(EventType.Helltide, client, db);
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
  // const response = await fetch(`https://diablo4.life/api/trackers/${eventType}/list`);
  // const { event } = await response.json() as Response;
	const event = {
		"name": "Ashava the Pestilent",
		"time": 1687046460000,
		"location": "Seared Basin - Kehjistan",
		"confidence": {
			"name": {
				"Ashava the Pestilent": 1
			},
			"location": {
				"Seared Basin - Kehjistan": 0.96,
				"Saraan Caldera - Dry Steppes": 0.04
			},
			"time": {
				"1687046520000": 0.08,
				"1687046460000": 0.92
			}
		}
	}
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
