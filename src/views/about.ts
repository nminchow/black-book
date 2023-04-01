import {APIEmbed} from 'discord.js';

const about = () => {
  const description =
    'The bot uses the data extracted from the game by Lothrik for his [build calculator](https://github.com/Lothrik/diablo4-build-calc). ' +
    'His hard work is immensly appreciated! If you see problems with the data, see if they are also reflected there. ' +
    'If there is something wrong with the bot itself, please let me know! Both of us can currently be found in the discord below.\n\n' +
    `Official Diablo 4 Discord: http://discord.gg/diablo4#discord`;
  const text =
    'by @LeonRdo#4563 - ' +
    `Need a custom bot? Email me at noel@paysly.io, or hop into the official d4 discord server listed above and DM me.`;
  const embed: APIEmbed = {
    author: {
      name: 'Diablo Black Book',
      icon_url: 'https://static.wikia.nocookie.net/diablo/images/0/09/Act3Q4.gif',
    },
    description,
    footer: {
      text,
      icon_url: 'https://ethos-chat.pages.dev/yoshi.webp',
    },
  };

  return embed;
};

export default about;
