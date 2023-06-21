import {APIEmbed} from 'discord.js';
import { EventResponse } from '../worldEvents/createListener';
import { addTerritory, author } from './shared';

const worldBoss = (event: EventResponse) => {
  const title = `${event.name} is stirring in ${event.location}!`;

  const url = 'https://diablo4.life/trackers/world-bosses';
  const description = `[${event.location}](${url}) - Spawns: <t:${event.time / 1000}:R>`

  const embed: APIEmbed = {
    title,
    author,
    description,
  };

  return [addTerritory(embed, event)];
};

export default worldBoss;
