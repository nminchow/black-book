import {
  CacheType,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js';
import aboutViewBuilder from '../views/about';

const name = 'about';

const aboutBuilder = new SlashCommandBuilder()
  .setName(name)
  .setDescription('get general info about the bot');

const about = () => ({
  name,
  execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
    const aboutView = aboutViewBuilder();
    interaction.reply({embeds: [aboutView]});
  },
});

export {aboutBuilder};
export default about;
