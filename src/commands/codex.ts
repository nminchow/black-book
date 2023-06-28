import {
  CacheType,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  AutocompleteInteraction,
} from 'discord.js';
import codexDatabase, { codexFuse } from '../data/codexDatabase';
import codexViewBuilder from '../views/codex';
import L from '../i18n/i18n-node';
import { commandLocaleMapping } from '../i18n/type-transformer';

const name = L.en.commands.codex.name();
const codexEntryNameOption = L.en.commands.codex.options.codexEntryNameOption.name();

const codexBuilder = new SlashCommandBuilder()
  .setName(name)
  .setNameLocalizations(commandLocaleMapping.codex.name)
  .setDescription(L.en.commands.codex.description())
  .setDescriptionLocalizations(commandLocaleMapping.codex.description)
  .addStringOption(option =>
		option.setName(codexEntryNameOption)
      .setNameLocalizations(commandLocaleMapping.codex.options.codexEntryNameOption.name)
			.setDescription(L.en.commands.codex.options.codexEntryNameOption.description())
      .setDescriptionLocalizations(commandLocaleMapping.codex.options.codexEntryNameOption.description)
			.setAutocomplete(true)
      .setRequired(true));

const codex = () => ({
  name,
  execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
    const codexEntryName = interaction.options.getString(codexEntryNameOption) || '';
    const codexEntry = codexDatabase[codexEntryName];
    if (!codexEntry) {
      interaction.reply(L.en.commands.codex.errors.notFound());
      return;
    }

    const codexView = await codexViewBuilder(codexEntry);
    interaction.reply({embeds: [codexView]});
  },
  autocomplete: async (interaction: AutocompleteInteraction<CacheType>) => {
    const focusedValue = interaction.options.getFocused();
    const result = codexFuse.search(focusedValue, { limit: 25 });
		await interaction.respond(
			result.map(({ item: { name } }) => ({ name, value: name })),
		);
  },
});

export {codexBuilder};
export default codex;
