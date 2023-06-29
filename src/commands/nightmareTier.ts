import {
  CacheType,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js';
import nightmareTierViewBuilder from '../views/nightmareTier';
import L from '../i18n/i18n-node';
import { commandLocaleMapping } from '../i18n/type-transformer';

const name = L.en.commands.nightmareTier.name();
const description = L.en.commands.nightmareTier.description();

const nightmareTierBuilder = new SlashCommandBuilder()
  .setName(name)
  .setNameLocalizations(commandLocaleMapping.nightmareTier.name)
  .setDescription(description)
  .setDescriptionLocalizations(commandLocaleMapping.nightmareTier.description);

const nightmareTier = () => ({
  name,
  execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
    const aboutView = nightmareTierViewBuilder();
    interaction.reply({embeds: [aboutView]});
  },
});

export {nightmareTierBuilder};
export default nightmareTier;
