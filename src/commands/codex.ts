import {
  CacheType,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  AutocompleteInteraction
} from 'discord.js';
import codexDatabase, { codexFuse } from '../data/codexDatabase';
import codexViewBuilder from '../views/codex';

const name = 'codex';
const codexEntryNameOption = 'name';

const codexBuilder = new SlashCommandBuilder()
  .setName(name)
  .setDescription('find a codex entry by name')
  .addStringOption(option =>
		option.setName(codexEntryNameOption)
			.setDescription('codex entry name')
			.setAutocomplete(true)
      .setRequired(true));

const codex = () => ({
  name,
  execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
    const codexEntryName = interaction.options.getString(codexEntryNameOption) || '';
    const codexEntry = codexDatabase[codexEntryName];
    if (!codexEntry) {
      interaction.reply('codex entry not found!');
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
