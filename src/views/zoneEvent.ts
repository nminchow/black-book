import {APIEmbed} from 'discord.js';
import { EventParams, NotificationMetadata, SubRecord } from '../worldEvents/createListener';
import { addTerritory, author, buildLocationString, colors } from './shared';
import L from '../i18n/i18n-node';

const zoneEvent = (event: EventParams, _: NotificationMetadata, sub: SubRecord) => {
  const location = buildLocationString(event, sub.locale);
  const title = L[sub.locale].views.events.zoneEvent.title({ location });

  const url = 'https://diablo4.life/trackers/zone-events';

  const embed: APIEmbed = {
    title,
    author,
    fields: [
      {
        name: L[sub.locale].views.events.helltide.locationUrl(),
        value: `[${location}](${url})`,
        inline: true
      },
      {
        name: L[sub.locale].views.events.zoneEvent.startLabel(),
        value: `<t:${event.time / 1000}:R>`,
        inline: true,
      }
    ],
    color: colors.zoneEventEmber,
  };

  return sub.zone_and_boss_images ? [addTerritory(embed, event)] : [embed];
};

export default zoneEvent;
