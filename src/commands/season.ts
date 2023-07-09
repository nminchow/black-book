import {
  CacheType,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js';
import seasonViewBuilder from '../views/season';
import L from '../i18n/i18n-node';
import { commandLocaleMapping } from '../i18n/type-transformer';

const name = L.en.commands.season.name();

const seasonBuilder = new SlashCommandBuilder()
  .setName(name)
  .setNameLocalizations(commandLocaleMapping.season.name)
  .setDescription(L.en.commands.season.description())
  .setDescriptionLocalizations(commandLocaleMapping.season.description);

const about = () => ({
  name,
  execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
    const seasonView = await seasonViewBuilder();
    interaction.reply({embeds: [seasonView]});
  },
});

export {seasonBuilder};
export default about;
