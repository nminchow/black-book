import {
  CacheType,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js';
import { CommandBuilers } from '.';
import helpViewBuilder from '../views/help';
import L from '../i18n/i18n-node';
import { commandLocaleMapping } from '../i18n/type-transformer';

const name = L.en.commands.help.name();

const helpBuilder = new SlashCommandBuilder()
  .setName(name)
  .setNameLocalizations(commandLocaleMapping.help.name)
  .setDescription(L.en.commands.help.description())
  .setDescriptionLocalizations(commandLocaleMapping.help.description);

const help = (commands: CommandBuilers) => ({
  name,
  execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
    const helpView = helpViewBuilder(commands);
    interaction.reply({embeds: [helpView]});
  },
});

export {helpBuilder};
export default help;
