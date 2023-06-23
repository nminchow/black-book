import {APIEmbed} from 'discord.js';
import { EventResponse, NotificationMetadata, SubRecord } from '../worldEvents/createListener';
import { author } from './shared';

const getWarningBlurb = (event: EventResponse, sub: SubRecord) => {
  const endDate = new Date(event.time)
  const willMove = endDate.getMinutes() > 1;
  if (!willMove) return '';

  endDate.setMinutes(0);
  endDate.setSeconds(0);
  endDate.setMilliseconds(0);

  const warning = sub.helltide_images ? ' (image will not update. WIP!)' : '';

  return `\nChests respawn: <t:${(endDate.getTime() / 1000)}:R>${warning}`;
};

const hellTide = (event: EventResponse, meta: NotificationMetadata, sub: SubRecord) => {
  const title = `${event.name} in ${event.location}!`;

  const url = 'https://d4armory.io/events/helltides/';

  const start = `Start: <t:${(event.time - 3600000) / 1000}:R>\n`;
  const end = `End: <t:${(event.time) / 1000}:R>`

  const description = `[${event.location} chest locations](${url})\n${start}${end}${getWarningBlurb(event, sub)}`;

  const embed: APIEmbed = {
    title,
    author,
    description,
  };

  if (sub.helltide_images) {
    embed.image = {
      url: meta.imagePath
    }
  }

  return [embed];
};

export default hellTide;
