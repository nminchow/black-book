import {
  AutocompleteInteraction,
  CacheType,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js';
import seasonViewBuilder from '../views/season';
import L from '../i18n/i18n-node';
import { commandLocaleMapping } from '../i18n/type-transformer';

const name = L.en.commands.season.name();

const infoName = 'info';

const seasonBuilder = new SlashCommandBuilder()
  .setName(name)
  .setNameLocalizations(commandLocaleMapping.season.name)
  .setDescription(L.en.commands.season.description())
  .setDescriptionLocalizations(commandLocaleMapping.season.description)
  .addSubcommand(subcommand => subcommand
    .setName(infoName)
    .setDescription(L.en.commands.season.description()))

const season = () => ({
  name,
  execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
    if (interaction.options.getSubcommand() == infoName) {
      const seasonView = await seasonViewBuilder();
      await interaction.reply({embeds: [seasonView]});
      return;
    }
  },
});

export {seasonBuilder};
export default season;
