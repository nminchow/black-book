import {APIEmbed} from 'discord.js';
import { EventParams, NotificationMetadata, SubRecord } from '../worldEvents/createListener';
import { author, buildLocationString } from './shared';
import { snapToHour } from '../utility/helltideUpdateCheck';
import L from '../i18n/i18n-node';

const getMessage = (meta: NotificationMetadata, sub: SubRecord | HellViewFlags) => {
  if (!sub.helltide_images) return '';
  if (!meta.imagePath) return L[sub.locale].views.events.hellide.noImage();
  if (meta.isUpdated) return L[sub.locale].views.events.hellide.updateDone();
  return L[sub.locale].views.events.hellide.updatePending();
};

const getWarningBlurb = (event: EventParams, meta: NotificationMetadata, sub: SubRecord | HellViewFlags) => {
  const endDate = new Date(event.time)
  const willMove = endDate.getMinutes() > 1;
  if (!willMove) return '';

  const respawn = snapToHour(endDate);

  return `\n${L[sub.locale].views.events.hellide.chestsRespawnLabel()} <t:${(respawn.getTime() / 1000)}:R>${getMessage(meta, sub)}`;
};

export type HellViewFlags = Pick<SubRecord, 'helltide_images' | 'locale'>

const hellTide = (event: EventParams, meta: NotificationMetadata, sub: SubRecord | HellViewFlags) => {
  const location = buildLocationString(event, sub.locale);
  const title = L[sub.locale].views.events.hellide.title({ location });

  const url = 'https://d4armory.io/events/helltides/';

  const start = `${L[sub.locale].views.events.hellide.startLabel()} <t:${(event.time - 3600000) / 1000}:R>\n`;
  const end = `${L[sub.locale].views.events.hellide.endLabel()} <t:${(event.time) / 1000}:R>`

  const description = `[${L[sub.locale].views.events.hellide.locationUrl({ location })}](${url})\n${start}${end}${getWarningBlurb(event, meta, sub)}`;

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
