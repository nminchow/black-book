import {APIEmbed} from 'discord.js';
import { author } from './shared';

const url = 'https://i.imgur.com/hyJ9zsz.jpg';

const hellTideMap = () => {
  const embed: APIEmbed = {
    title: 'Helltide Mystery Chest Map',
    url,
    author,
    image: {
      url
    },
    fields: [
      {
        name: 'Zones',
        value: 'One mystery chest is available in each map zone during a helltide.'
      },
      {
        name: 'Locations',
        value: 'Mystery chests are not visible on the world map until you are in close proximity to them. Once you are near, they will become visible on your minimap.'
      },
      {
        name: '',
        value: 'Mystery chests move locations when real time clock hits a full hour in each zone. When this happens, mystery chests can be reopened in the new location, allowing you to get more than two during one helltide.'
      },
      {
        name: '',
        value: `The \`/events\` command can be used to get notifications on upcoming helltides.`
      }
    ]
  };

  return embed;
};

export default hellTideMap;
