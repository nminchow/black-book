import {APIEmbed} from 'discord.js';
import { EventResponse, NotificationMetadata, SubRecord } from '../worldEvents/createListener';
import { author } from './shared';
import { snapToHour } from '../utility/helltideUpdateCheck';

const getMessage = (meta: NotificationMetadata, sub: SubRecord | ImageFlag) => {
  if (!sub.helltide_images) return '';
  if (!meta.imagePath) return ' (image unavailable - this is likely due to a service outage and should resolve shortly)';
  if (meta.isUpdated) return ' (image updated)';
  return ' (image will update)'
};

const getWarningBlurb = (event: EventResponse, meta: NotificationMetadata, sub: SubRecord | ImageFlag) => {
  const endDate = new Date(event.time)
  const willMove = endDate.getMinutes() > 1;
  if (!willMove) return '';

  const respawn = snapToHour(endDate);

  return `\nChests respawn: <t:${(respawn.getTime() / 1000)}:R>${getMessage(meta, sub)}`;
};

export type ImageFlag = Pick<SubRecord, 'helltide_images'>

const hellTide = (event: EventResponse, meta: NotificationMetadata, sub: SubRecord | ImageFlag) => {
  const title = `${event.name} in ${event.location}!`;

  const url = 'https://d4armory.io/events/helltides/';

  const start = `Start: <t:${(event.time - 3600000) / 1000}:R>\n`;
  const end = `End: <t:${(event.time) / 1000}:R>`

  const description = `[${event.location} chest locations](${url})\n${start}${end}${getWarningBlurb(event, meta, sub)}`;

  const embed: APIEmbed = {
    title,
    author,
    description,
  };

  if (sub.helltide_images && meta.imagePath) {
    embed.image = {
      url: meta.imagePath
    }
  }

  return [embed];
};

export default hellTide;
