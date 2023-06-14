import {APIEmbed} from 'discord.js';
import { author } from './shared';

const about = () => {
  const description =
    'The bot uses the data extracted from the game by Lothrik for his [build calculator](https://github.com/Lothrik/diablo4-build-calc). ' +
    'His hard work is immensly appreciated! If you see problems with the data, see if they are also reflected there. ' +
    'If there is something wrong with the bot itself, please let me know!\n\n You can find me in ' +
    `[the official support server](http://discord.gg/2nkfTRyvJh).\n`;
  const text =
    'by @LeonRdo#4563 - ' +
    `Need a custom bot? Email me at noel@paysly.io, or hop into the discord server listed above and DM me.`;
  const embed: APIEmbed = {
    author,
    description,
    footer: {
      text,
      icon_url: 'https://ethos-chat.pages.dev/yoshi.webp',
    },
  };

  return embed;
};

export default about;
