import {
  CacheType,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js';
import xpCurveViewBuilder from '../views/xpCurve';
import L from '../i18n/i18n-node';
import { commandLocaleMapping } from '../i18n/type-transformer';

const name = L.en.commands.xpCurve.name();
const description = L.en.commands.xpCurve.description();

const xpCurveBuilder = new SlashCommandBuilder()
  .setName(name)
  .setNameLocalizations(commandLocaleMapping.xpCurve.name)
  .setDescription(description)
  .setDescriptionLocalizations(commandLocaleMapping.xpCurve.description);

const xpCurve = () => ({
  name,
  execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
    const aboutView = xpCurveViewBuilder();
    await interaction.reply({embeds: [aboutView]});
  },
});

export {xpCurveBuilder};
export default xpCurve;
