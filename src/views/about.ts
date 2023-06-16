import {APIEmbed, CacheType, ChatInputCommandInteraction} from 'discord.js';
import { author } from './shared';
import { dbWrapper } from '../bot';

const dbFields = async (db: dbWrapper) => {
  if (!db) {
    return [];
  }
  const { count: subs } = await db.from('subscriptions').select('*', { count: 'exact', head: true });
  const { count: events } = await db.from('events').select('*', { count: 'exact', head: true });
  return [
    {
      name: 'Channels Listening for Events',
      value: (subs || 0).toString(),
    },
    {
      name: 'Events Processed',
      value: (events || 0).toString(),
    },
  ];
}

const about = async (interaction: ChatInputCommandInteraction<CacheType>, db: dbWrapper) => {
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
    fields: [
      {
        name: "Server Count",
        value: interaction.client.guilds.cache.size.toString()
      },
      {
        name: "User Count",
        value: interaction.client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0).toString()
      },
      ...await dbFields(db),
    ]
  };

  return embed;
};

export default about;
