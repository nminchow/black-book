import {APIEmbed} from 'discord.js';
import { EventResponse } from '../worldEvents/createListener';
import { author } from './shared';

const hellTide = (event: EventResponse) => {
  const title = `${event.name} in ${event.location}!`;

  const url = 'https://d4armory.io/events/helltides/';

  const start = `Start: <t:${(event.time - 3600000) / 1000}:R>\n`;
  const end = `End: <t:${(event.time) / 1000}:R>`

  const description = `[${event.location} chest locations](${url})\n${start}${end}`

  const embed: APIEmbed = {
    title,
    author,
    description,
  };

  return [embed];
};

export default hellTide;
