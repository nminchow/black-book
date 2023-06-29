import {APIEmbed} from 'discord.js';
import { EventResponse, NotificationMetadata, SubRecord } from '../worldEvents/createListener';
import { addTerritory, author } from './shared';
import L from '../i18n/i18n-node';

const worldBoss = (event: EventResponse, _: NotificationMetadata, sub: SubRecord) => {
  const title = L[sub.locale].views.events.worldBoss.title(event);

  const url = 'https://diablo4.life/trackers/world-bosses';
  const description = `[${event.location}](${url}) - ${L[sub.locale].views.events.worldBoss.spawnLabel()} <t:${event.time / 1000}:R>`

  const embed: APIEmbed = {
    title,
    author,
    description,
  };

  return sub.zone_and_boss_images ? [addTerritory(embed, event)] : [embed];
};

export default worldBoss;
