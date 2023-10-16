import {APIEmbed} from 'discord.js';

const url = 'https://diablo4.blizzard.com/en-us/upcoming';

const season = () => {

  const description = `Starts: <t:1697562000:R>\nEnds (approx): <t:1705514400:D>\n
  Going forward, renown will always persist between seasons and new characters!\n
  [More Info](${url})`;
  const embed: APIEmbed = {
    title: 'Season of Blood',
    description,
    url,
    thumbnail: {
      url: 'https://imagedelivery.net/4IwmCTEGUuDpGZFeCvePxQ/102dca39-b1bd-48b0-badb-11525d377400/public'
    },
  };

  return embed;
};

export default season;
