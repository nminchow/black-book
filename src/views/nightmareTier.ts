import {APIEmbed} from 'discord.js';
import { author } from './shared';

const url = 'https://i.imgur.com/btT0n4D.jpg';

const nightmareTier = () => {
  const description = '[advanced tier-list spreadsheet](https://docs.google.com/spreadsheets/d/143tXzN_7-yoQCy7QEjo924UT2kWqH1VhWyXEsOvlwgA/htmlview#gid=0)';
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
