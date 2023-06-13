import {
  CacheType,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js';
import { dbWrapper } from '../bot';

const name = 'events';

const eventsBuilder = new SlashCommandBuilder()
  .setName(name)
  .setDescription('get updates on helltides and world bosses');

const events = (db: dbWrapper) => ({
  name,
  execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
    if ( !db ) {
      interaction.reply('db not initialized');
      return;
    }
    const {error: insertionError} = await db
      .from('subscriptions')
      .insert([
        {
          channel_id: interaction.channelId,
          guild_id: interaction.guildId || 'unknown',
        },
      ])
      .select();
    if (insertionError) {
      console.error(insertionError);
      interaction.reply('something went wrong!')
    }
    interaction.reply('events will be posted in this channel! (Use `/unsub` to stop event posts)');
  },
});

export {eventsBuilder};
export default events;
