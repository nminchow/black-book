import {
  AutocompleteInteraction,
  CacheType,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js';
import seasonViewBuilder from '../views/season';
import L from '../i18n/i18n-node';
import { commandLocaleMapping } from '../i18n/type-transformer';
import seasonalAffixes, { seasonalAffixesFuse } from '../data/affixDatabase';
import malignantHeart from '../views/malignantHeart';

const name = L.en.commands.season.name();

const malignantHeartName = 'malignant-heart';
const malignantHeartNameOption = 'name';
const infoName = 'info';

const seasonBuilder = new SlashCommandBuilder()
  .setName(name)
  .setNameLocalizations(commandLocaleMapping.season.name)
  .setDescription(L.en.commands.season.description())
  .setDescriptionLocalizations(commandLocaleMapping.season.description)
  .addSubcommand(subcommand => subcommand
    .setName(infoName)
    .setDescription(L.en.commands.season.description()))
  .addSubcommand(subcommand => subcommand
    .setName(malignantHeartName)
    .setDescription('Info about hearts')
    .addStringOption(option =>
      option.setName(malignantHeartNameOption)
        .setDescription('Malignant Heart Name')
        .setAutocomplete(true)
        .setRequired(true)
      )
  )

const season = () => ({
  name,
  execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
    if (interaction.options.getSubcommand() == infoName) {
      const seasonView = await seasonViewBuilder();
      interaction.reply({embeds: [seasonView]});
      return;
    }
    const entryName = interaction.options.getString(malignantHeartNameOption) || '';
    const entry = seasonalAffixes[entryName];
    if (!entry) {
      interaction.reply('heart not found');
      return
    }
   const heartView = await malignantHeart(entry);
   interaction.reply({embeds: [heartView]});
  },
  autocomplete: async (interaction: AutocompleteInteraction<CacheType>) => {
    const focusedValue = interaction.options.getFocused();
    const result = seasonalAffixesFuse.search(focusedValue, { limit: 25 });
		await interaction.respond(
			result.map(({ item: { name } }) => ({ name, value: name })),
		);
  },
});

export {seasonBuilder};
export default season;
