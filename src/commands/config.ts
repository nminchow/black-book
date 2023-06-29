import {
  CacheType,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js';
import configViewBuilder from '../views/config';
import { dbWrapper } from '../bot';
import L from '../i18n/i18n-node';
import { commandLocaleMapping } from '../i18n/type-transformer';

const name = L.en.commands.config.name();

const configBuilder = new SlashCommandBuilder()
  .setName(name)
  .setNameLocalizations(commandLocaleMapping.config.name)
  .setDescription('view your current configuration')
  .setDescriptionLocalizations(commandLocaleMapping.config.description);

const config = (db: dbWrapper) => ({
  name,
  execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
    if ( !db ) {
      interaction.reply('db not initialized');
      return;
    }
    const configView = await configViewBuilder(interaction, db);
    interaction.reply({embeds: [configView]});
  },
});

export {configBuilder};
export default config;
