import {APIEmbed} from 'discord.js';
import { author } from './shared';

const url = 'https://i.imgur.com/PpEDsxA.png';

const nightmareTier = () => {
  const description = `[wudijo's spreadsheet](https://docs.google.com/spreadsheets/d/143tXzN_7-yoQCy7QEjo924UT2kWqH1VhWyXEsOvlwgA/htmlview#gid=0)
  [Raxxanterax's spreadsheet (image below) ](https://docs.google.com/spreadsheets/d/1lJIPOom_2aRWkwzZHKGkkWU0mVCGV5kFZZXtgYuuYyo/htmlview?usp=sharing)`;
  const embed: APIEmbed = {
    description,
    url,
    author,
    image: {
      url
    },
  };

  return embed;
};

export default nightmareTier;
