import { ClientAndCommands, dbWrapper } from "../bot";
import hellTide from "../views/hellTide";
import { EventType } from "../worldEvents/createListener";
import { createImage } from "./createImage";

export const snapToHour = (dateInput: Date) => {
  const date = new Date(dateInput.getTime()); // clone just to be safe
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date;
};

export const helltideUpdateCheck = async (client: ClientAndCommands, db: NonNullable<dbWrapper>) => {
  // 1. query for helltides that have not yet ended and we haven't already updated
  const { data, error } = await db.from('events').select()
    .filter('time', 'gt', new Date().toISOString())
    .filter('type', 'eq', EventType.Helltide)
    .filter('has_updated', 'eq', false)
    .order('created_at', { ascending: false })
    .limit(1)

  if (error) {
    console.error('error querying helltides for updates!');
    return;
  }

  if (!data || !data[0]) return;

  const event = data[0];


  const endTime = new Date(Date.parse(`${event.time}Z`));
  const respawn = snapToHour(endTime);

  const twoMinutesAgo = new Date();
  twoMinutesAgo.setMinutes(twoMinutesAgo.getMinutes() - 2);


  if (respawn > twoMinutesAgo) return;


  const { error: updateError } = await db.from('events').update({has_updated: true}).filter('id', 'eq', event.id);
  if (updateError) {
    console.error('error updating event record');
    return;
  }

  const image = await createImage(db);

  const { data: notificationList, error: notificationError } = await db.from('notifications')
    .select()
    .filter('event', 'eq', data[0].id)

  if (notificationError) {
    console.error('error fetching notification records');
    return;
  }

  const view = hellTide(
    { name: event.name, location: event.location, time: endTime.getTime() },
    { imagePath: image, isUpdated: true },
    { helltide_images: true }
  );

  notificationList.map(async ({ channel_id, message_id }) => {
    try {
      const channel = client.channels.cache.get(channel_id);
      if (!channel || !channel.isTextBased()) return;

      const message = await channel.messages.fetch(message_id);
      if (!message.embeds[0].image?.url) return; // only update those that had an image when posted.
      message.edit({embeds: view});
    } catch (error) {
      console.error('error editing message');
      console.error(error);
    }
  });
};
