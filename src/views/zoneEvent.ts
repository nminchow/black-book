import {APIEmbed} from 'discord.js';
import { EventResponse } from '../worldEvents/createListener';
import { author } from './shared';

const zoneEvent = (event: EventResponse) => {
  const title = `${event.name} in ${event.location}!`;

  const url = 'https://diablo4.life/trackers/zone-events';

  const description = `[${event.location}](${url}) - Starts: <t:${event.time / 1000}:R>`

  const embed: APIEmbed = {
    title,
    author,
    description,
  };

  return embed;
};

export default zoneEvent;
