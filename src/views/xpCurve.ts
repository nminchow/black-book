import {APIEmbed} from 'discord.js';
import { author } from './shared';

const url = 'https://i.imgur.com/KRCF0h1.jpg';

const xpCurve = () => {
  const embed: APIEmbed = {
    url,
    author,
    image: {
      url
    },
  };

  return embed;
};

export default xpCurve;
