import {
  CacheType,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js';
import { CommandBuilers } from '.';
import helpViewBuilder from '../views/help';

const name = 'help';

const helpBuilder = new SlashCommandBuilder()
  .setName(name)
  .setDescription('show a list of availble commands');

const help = (commands: CommandBuilers) => ({
  name,
  execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
    const helpView = helpViewBuilder(commands);
    interaction.reply({embeds: [helpView]});
  },
});

export {helpBuilder};
export default help;
