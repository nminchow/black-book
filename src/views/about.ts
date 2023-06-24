import {APIEmbed, CacheType, ChatInputCommandInteraction} from 'discord.js';
import { author } from './shared';
import { dbWrapper } from '../bot';

const formatNumber = (count: number | null) => {
  return new Intl.NumberFormat().format(count || 0);
};

const dbFields = async (db: dbWrapper) => {
  if (!db) {
    return [];
  }
  const { count: subs } = await db.from('subscriptions').select('*', { count: 'exact', head: true });
  const { count: events } = await db.from('events').select('*', { count: 'exact', head: true });
  const { count: notificaitons } = await db.from('notifications').select('*', { count: 'exact', head: true });
  return [
    {
      name: 'Channels Listening for Events',
      value: formatNumber(subs),
    },
    {
      name: 'Events Processed',
      value: formatNumber(events),
    },
    {
      name: 'Notifications Sent',
      value: formatNumber(notificaitons),
    },
  ];
}

const about = async (interaction: ChatInputCommandInteraction<CacheType>, db: dbWrapper) => {
  const description =
    'The bot is an open-source project available [here](https://github.com/nminchow/black-book). You can find more info on our readme. ' +
    'I\'m always looking for code contributions and support! ' +
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
        value: formatNumber(interaction.client.guilds.cache.size)
      },
      {
        name: "User Count",
        value: formatNumber(interaction.client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0))
      },
      ...await dbFields(db),
    ]
  };

  return embed;
};

export default about;
