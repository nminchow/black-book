import {
  CacheType,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js';
import { dbWrapper } from '../bot';
import L from '../i18n/i18n-node';
import { commandLocaleMapping } from '../i18n/type-transformer';

const name = L.en.commands.unsub.name();

const unsubBuilder = new SlashCommandBuilder()
  .setName(name)
  .setNameLocalizations(commandLocaleMapping.unsub.name)
  .setDescription(L.en.commands.unsub.description())
  .setDescriptionLocalizations(commandLocaleMapping.unsub.description);

export const deleteSubs = (db: NonNullable<dbWrapper>, interaction: ChatInputCommandInteraction) => {
  return db
      .from('subscriptions')
      .delete()
      .filter('channel_id', 'eq', interaction.channelId)
      .filter('guild_id', 'eq', interaction.guildId || 'unknown');
}

const unsub = (db: dbWrapper) => ({
  name,
  execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
    if ( !db ) {
      await interaction.reply('db not initialized');
      return;
    }
    const { error: deletionError } = await deleteSubs(db, interaction);
    if (deletionError) {
      console.error(deletionError);
      await interaction.reply('something went wrong!')
      return;
    }
    await interaction.reply('events will no longer be posted here!');
  },
});

export {unsubBuilder};
export default unsub;
