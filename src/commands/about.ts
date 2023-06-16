import {
  CacheType,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js';
import aboutViewBuilder from '../views/about';
import { dbWrapper } from '../bot';

const name = 'about';

const aboutBuilder = new SlashCommandBuilder()
  .setName(name)
  .setDescription('get general info about the bot');

const about = (db: dbWrapper) => ({
  name,
  execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
    const aboutView = await aboutViewBuilder(interaction, db);
    interaction.reply({embeds: [aboutView]});
  },
});

export {aboutBuilder};
export default about;
