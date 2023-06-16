import {APIEmbed} from 'discord.js';
import { author } from './shared';

const url = 'https://i.imgur.com/btT0n4D.jpg';

const nightmareTier = () => {
  const embed: APIEmbed = {
    url,
    author,
    image: {
      url
    },
  };

  return embed;
};

export default nightmareTier;
