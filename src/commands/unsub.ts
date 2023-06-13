import {
  CacheType,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js';
import { dbWrapper } from '../bot';

const name = 'unsub';

const unsubBuilder = new SlashCommandBuilder()
  .setName(name)
  .setDescription('unsubscribe from helltide and world boss updates');

const unsub = (db: dbWrapper) => ({
  name,
  execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
    if ( !db ) {
      interaction.reply('db not initialized');
      return;
    }
    const {error: deletionError} = await db
      .from('subscriptions')
      .delete()
      .filter('channel_id', 'eq', interaction.channelId)
      .filter('guild_id', 'eq', interaction.guildId);
    if (deletionError) {
      console.error(deletionError);
      interaction.reply('something went wrong!')
    }
    interaction.reply('events will no longer be posted here!');
  },
});

export {unsubBuilder};
export default unsub;
