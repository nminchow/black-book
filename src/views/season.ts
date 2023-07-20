import {APIEmbed} from 'discord.js';

const url = 'https://news.blizzard.com/en-us/diablo4/23967322/malignance-runs-rampant-in-the-first-season-of-diablo-iv';

const season = () => {

  const description = `Starts: <t:1689872400:R>\nEnds (approx): <t:1697785200:D>\n
  Alter and map progress will carry over from eternal, but you will need to log into those characters `
  +`shortly before or after the season begins.
  [More Info](${url})`;
  const embed: APIEmbed = {
    title: 'Season of the Malignant',
    description,
    url,
    thumbnail: {
      url: 'https://imagedelivery.net/4IwmCTEGUuDpGZFeCvePxQ/f3d7bfdf-ea89-40a6-8120-3a3143fdb900/public'
    },
  };

  return embed;
};

export default season;
