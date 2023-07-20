import {
  CacheType,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  AutocompleteInteraction
} from 'discord.js';
import paragonDatabase, { paragonFuse } from '../data/paragonDatabase';
import paragonViewBuilder from '../views/paragon';
import L from '../i18n/i18n-node';
import { commandLocaleMapping } from '../i18n/type-transformer';

const name = L.en.commands.paragon.name();
const paragonEntryNameOption = L.en.commands.paragon.options.entryName.name();

const paragonBuilder = new SlashCommandBuilder()
  .setName(name)
  .setNameLocalizations(commandLocaleMapping.paragon.name)
  .setDescription(L.en.commands.paragon.description())
  .setDescriptionLocalizations(commandLocaleMapping.paragon.description)
  .addStringOption(option =>
		option.setName(paragonEntryNameOption)
      .setNameLocalizations(commandLocaleMapping.paragon.options.entryName.name)
			.setDescription(L.en.commands.paragon.options.entryName.description())
      .setDescriptionLocalizations(commandLocaleMapping.paragon.options.entryName.description)
			.setAutocomplete(true)
      .setRequired(true));

const paragon = () => ({
  name,
  execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
    const codexEntryName = interaction.options.getString(paragonEntryNameOption) || '';
    const codexEntry = paragonDatabase[codexEntryName];
    if (!codexEntry) {
      await interaction.reply(L.en.commands.paragon.errors.notFound());
      return;
    }

    const codexView = await paragonViewBuilder(codexEntry);
    await interaction.reply({embeds: [codexView]});
  },
  autocomplete: async (interaction: AutocompleteInteraction<CacheType>) => {
    const focusedValue = interaction.options.getFocused();
    const result = paragonFuse.search(focusedValue, { limit: 25 });
		await interaction.respond(
			result.map(({ item: { name } }) => ({ name, value: name })),
		);
  },
});

export {paragonBuilder};
export default paragon;
