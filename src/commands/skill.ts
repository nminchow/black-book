import {
  CacheType,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  AutocompleteInteraction
} from 'discord.js';
import combinedSkills, { skillFuse } from '../data/skillDatabase';
import skillViewBuilder from '../views/skill';
import L from '../i18n/i18n-node';
import { commandLocaleMapping } from '../i18n/type-transformer';

const name = L.en.commands.skill.name();
const skillNameOption = L.en.commands.skill.options.skillName.name();

const skillBuilder = new SlashCommandBuilder()
  .setName(name)
  .setNameLocalizations(commandLocaleMapping.skill.name)
  .setDescription(L.en.commands.skill.description())
  .setDescriptionLocalizations(commandLocaleMapping.skill.description)
  .addStringOption(option =>
		option.setName(skillNameOption)
      .setNameLocalizations(commandLocaleMapping.skill.options.skillName.name)
			.setDescription(L.en.commands.skill.options.skillName.description())
      .setDescriptionLocalizations(commandLocaleMapping.skill.options.skillName.description)
			.setAutocomplete(true)
      .setRequired(true));

const skill = () => ({
  name,
  execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
    const skillName = interaction.options.getString(skillNameOption) || '';
    const skill = combinedSkills[skillName];
    if (!skill) {
      await interaction.reply(L.en.commands.skill.errors.notFound());
      return;
    }

    const skillView = await skillViewBuilder(skill);
    await interaction.reply({embeds: [skillView]});
  },
  autocomplete: async (interaction: AutocompleteInteraction<CacheType>) => {
    const focusedValue = interaction.options.getFocused();
    const result = skillFuse.search(focusedValue, { limit: 25 });
		await interaction.respond(
			result.map(({ item: { skill } }) => ({ name: skill, value: skill })),
		);
  },
});

export {skillBuilder};
export default skill;
