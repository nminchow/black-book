import {
  CacheType,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js';
import configViewBuilder from '../views/config';
import { dbWrapper } from '../bot';

const name = 'config';

const configBuilder = new SlashCommandBuilder()
  .setName(name)
  .setDescription('view your current configuration');

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
