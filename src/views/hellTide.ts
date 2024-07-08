import {APIEmbed} from 'discord.js';
import { EventParams, NotificationMetadata, SubRecord } from '../worldEvents/createListener';
import { author, buildLocationString } from './shared';
import L from '../i18n/i18n-node';

export type HellViewFlags = Pick<SubRecord, 'helltide_images' | 'locale'>

const hellTide = (event: EventParams, meta: NotificationMetadata, sub: SubRecord | HellViewFlags) => {
  const location = buildLocationString(event, sub.locale);
  const title = L[sub.locale].views.events.hellide.title({ location });

  const url = 'https://d4armory.io/events/helltides/';

  const start = `${L[sub.locale].views.events.hellide.startLabel()} <t:${(event.time - 3300000) / 1000}:R>\n`;
  const end = `${L[sub.locale].views.events.hellide.endLabel()} <t:${(event.time) / 1000}:R>`

  const description = `[${L[sub.locale].views.events.hellide.locationUrl({ location })}](${url})\n${start}${end}`;

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
