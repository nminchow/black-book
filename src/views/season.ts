import {APIEmbed} from 'discord.js';

const url = 'https://diablo4.blizzard.com/en-us/upcoming';

const season = () => {

  const description = `Starts: <t:1715698800:R>\nEnds (approx): <t:1722956400:D>\n
  Loot Reborn! D4 ~~bad~~ good!\n
  [More Info](${url})`;
  const embed: APIEmbed = {
    title: 'Season of Loot Reborn',
    description,
    url,
    thumbnail: {
      url: 'https://blz-contentstack-images.akamaized.net/v3/assets/bltf408a0557f4e4998/blta6d501757dc037ff/663d2ee5f64609224f6a9662/en_Partner_Logo.png?imwidth=320&imdensity=2.625'
    },
  };

  return embed;
};

export default season;
