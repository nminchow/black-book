import {APIEmbed} from 'discord.js';
import { EventParams, NotificationMetadata, SubRecord } from '../worldEvents/createListener';
import { author, buildLocationString, colors, emptyField } from './shared';
import { snapToHour } from '../utility/helltideUpdateCheck';
import L from '../i18n/i18n-node';

const getMessage = (meta: NotificationMetadata, sub: SubRecord | HellViewFlags) => {
  if (!sub.helltide_images) return '';
  if (!meta.imagePath) return L[sub.locale].views.events.helltide.noImage();
  if (meta.isUpdated) return L[sub.locale].views.events.helltide.updateDone();
  return L[sub.locale].views.events.helltide.updatePending();
};

const getWarningBlurb = (event: EventParams, meta: NotificationMetadata, sub: SubRecord | HellViewFlags) => {
  const endDate = new Date(event.time)
  const willMove = endDate.getMinutes() > 1;
  if (!willMove) return [];

  const respawn = snapToHour(endDate);

  return [
    {
      name: L[sub.locale].views.events.helltide.chestsRespawnLabel(),
      value: `<t:${(respawn.getTime() / 1000)}:R>${getMessage(meta, sub)}`,
      inline: true,
    },
    emptyField,
  ];
};

export type HellViewFlags = Pick<SubRecord, 'helltide_images' | 'locale'>

const hellTide = (event: EventParams, meta: NotificationMetadata, sub: SubRecord | HellViewFlags) => {
  const location = buildLocationString(event, sub.locale);
  const title = L[sub.locale].views.events.helltide.title({ location });

  const url = 'https://d4armory.io/events/helltides/';

  const embed: APIEmbed = {
    title,
    author,
    fields: [
      {
        name: L[sub.locale].views.events.helltide.startLabel(),
        value: `<t:${(event.time - 3600000) / 1000}:R>`,
        inline: true
      },
      {
        name: L[sub.locale].views.events.helltide.endLabel(),
        value: `<t:${(event.time) / 1000}:R>`,
        inline: true
      },
      emptyField,
      {
        name: L[sub.locale].views.events.helltide.locationUrl(),
        value: `[${location}](${url})`,
        inline: true,
      },
      ...getWarningBlurb(event, meta, sub),
    ],
    color: colors.helltideRed,
  };

  if (sub.helltide_images && meta.imagePath) {
    embed.image = {
      url: meta.imagePath
    }
  }

  return [embed];
};

export default hellTide;
