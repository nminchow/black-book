import {
  CacheType,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js';
import hellTideViewBuilder from '../views/hellTideMap';
import L from '../i18n/i18n-node';
import { commandLocaleMapping } from '../i18n/type-transformer';

const name = L.en.commands.helltide.name();
const description = L.en.commands.helltide.description();

const hellTideBuilder = new SlashCommandBuilder()
  .setName(name)
  .setNameLocalizations(commandLocaleMapping.helltide.name)
  .setDescription(description)
  .setDescriptionLocalizations(commandLocaleMapping.helltide.description);

const hellTide = () => ({
  name,
  execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
    const aboutView = hellTideViewBuilder();
    interaction.reply({embeds: [aboutView]});
  },
});

export {hellTideBuilder};
export default hellTide;
