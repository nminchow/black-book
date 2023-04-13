import {
  CacheType,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  AutocompleteInteraction
} from 'discord.js';
import paragonDatabase, { paragonFuse } from '../data/paragonDatabase';
import paragonViewBuilder from '../views/paragon';

const name = 'paragon';
const paragonEntryNameOption = 'name';

const paragonBuilder = new SlashCommandBuilder()
  .setName(name)
  .setDescription('find a paragon entry by name')
  .addStringOption(option =>
		option.setName(paragonEntryNameOption)
			.setDescription('paragaon entry name')
			.setAutocomplete(true)
      .setRequired(true));

const paragon = () => ({
  name,
  execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
    const codexEntryName = interaction.options.getString(paragonEntryNameOption) || '';
    const codexEntry = paragonDatabase[codexEntryName];
    if (!codexEntry) {
      interaction.reply('codex entry not found!');
      return;
    }

    const codexView = await paragonViewBuilder(codexEntry);
    interaction.reply({embeds: [codexView]});
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
