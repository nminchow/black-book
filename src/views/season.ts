import {APIEmbed} from 'discord.js';

const url = 'https://diablo4.blizzard.com/en-us/upcoming';

const season = () => {

  const description = `Starts: <t:1728334800:R>\nEnds (approx): <t:1736287200:D>\n
  Vessel of Hatred is live!\n
  [More Info](${url})`;
  const embed: APIEmbed = {
    title: 'Season of Hatred Rising',
    description,
    url,
    thumbnail: {
      url: 'https://blz-contentstack-images.akamaized.net/v3/assets/blt77f4425de611b362/blt71bd7bff23658869/66f5bc98a6f25197052d9b09/d4_s6_logo_EN.webp?'
    },
  };

  return embed;
};

export default season;
