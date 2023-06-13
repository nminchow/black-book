import {APIEmbed} from 'discord.js';
import { CommandBuilers } from '../commands';
import { author } from './shared';

const help = (commands: CommandBuilers) => {
  const description =
    `If you need support, hop in ` +
    `[my guild's discord server](http://discord.gg/6K46Ue3XG9) and ping me (@LeonRdo#4563).\n`;
  const text =
    'by @LeonRdo#4563 - ' +
    `Need a custom bot? Email me at noel@paysly.io, or hop into the discord server listed above and DM me.`;
  const embed: APIEmbed = {
    author,
    description,
    fields: [
      {
        name: 'Commands:',
        value: '',
      },
      ...commands.map(({ name, description: value }) =>({
          name: `/${name}`,
          value
      })),
    ],
    footer: {
      text,
      icon_url: 'https://ethos-chat.pages.dev/yoshi.webp',
    },
  };

  return embed;
};

export default help;
