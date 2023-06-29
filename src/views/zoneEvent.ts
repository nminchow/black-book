import {APIEmbed} from 'discord.js';
import { EventResponse, NotificationMetadata, SubRecord } from '../worldEvents/createListener';
import { addTerritory, author } from './shared';
import L from '../i18n/i18n-node';

const zoneEvent = (event: EventResponse, _: NotificationMetadata, sub: SubRecord) => {
  const title = L[sub.locale].views.events.zoneEvent.title(event);

  const url = 'https://diablo4.life/trackers/zone-events';

  const description = `[${event.location}](${url}) - ${L[sub.locale].views.events.zoneEvent.startLabel()} <t:${event.time / 1000}:R>`

  const embed: APIEmbed = {
    title,
    author,
    description,
  };

  return sub.zone_and_boss_images ? [addTerritory(embed, event)] : [embed];
};

export default zoneEvent;
