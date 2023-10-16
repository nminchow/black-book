import {
  AutocompleteInteraction,
  CacheType,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js';
import seasonViewBuilder from '../views/season';
import L from '../i18n/i18n-node';
import { commandLocaleMapping } from '../i18n/type-transformer';
import vampiricPowers, { vampiricPowerFuse } from '../data/vampiricPowerDatabase';
import vampiricPower from '../views/vampiricPower';

const name = L.en.commands.season.name();

const infoName = 'info';

const vampiricPowerName = 'vampiric-power';
const vampiricPowerNameOption = 'name';

const seasonBuilder = new SlashCommandBuilder()
  .setName(name)
  .setNameLocalizations(commandLocaleMapping.season.name)
  .setDescription(L.en.commands.season.description())
  .setDescriptionLocalizations(commandLocaleMapping.season.description)
  .addSubcommand(subcommand => subcommand
    .setName(infoName)
    .setDescription(L.en.commands.season.description()))
  .addSubcommand(subcommand => subcommand
    .setName(vampiricPowerName)
    .setDescription('lookup details about vampiric powers')
    .addStringOption(option =>
      option.setName(vampiricPowerNameOption)
        .setDescription('vampiric power name')
        .setAutocomplete(true)
        .setRequired(true)
      )
  )

const season = () => ({
  name,
  execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
    if (interaction.options.getSubcommand() == infoName) {
      const seasonView = await seasonViewBuilder();
      await interaction.reply({embeds: [seasonView]});
      return;
    }
    const entryName = interaction.options.getString(vampiricPowerNameOption) || '';
    const entry = vampiricPowers[entryName];
    if (!entry) {
      await interaction.reply('heart not found');
      return
    }
   const heartView = await vampiricPower(entry);
   await interaction.reply({embeds: [heartView]});
  },
  autocomplete: async (interaction: AutocompleteInteraction<CacheType>) => {
    const focusedValue = interaction.options.getFocused();
    const result = vampiricPowerFuse.search(focusedValue, { limit: 25 });
		await interaction.respond(
			result.map(({ item: { name } }) => ({ name, value: name })),
		);
  },
});

export {seasonBuilder};
export default season;
