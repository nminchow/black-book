import {
  CacheType,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  AutocompleteInteraction
} from 'discord.js';
import coalesceSkillDescription from '../utility/coalesceSkillDescription';
import combinedSkills from '../data/database';
import skillViewBuilder from '../views/skill';

const name = 'skill';
const skillNameOption = 'name';

const skillBuilder = new SlashCommandBuilder()
  .setName(name)
  .setDescription('find a skill by name')
  .addStringOption(option =>
		option.setName(skillNameOption)
			.setDescription('skill name')
			.setAutocomplete(true)
      .setRequired(true));

const skill = () => ({
  name,
  execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
    const skillName = interaction.options.getString(skillNameOption) || '';
    const skill = combinedSkills[skillName];
    if (!skill) {
      interaction.reply('skill not found!');
      return;
    }

    const skillView = await skillViewBuilder({ skill: skillName, ...skill });
    interaction.reply({embeds: [skillView]});
  },
  autocomplete: async (interaction: AutocompleteInteraction<CacheType>) => {
    const focusedValue = interaction.options.getFocused();
    const choices = Object.keys(combinedSkills)
    const filtered = choices.filter(choice => choice.toLowerCase().startsWith(focusedValue.toLowerCase())).slice(0, 24);
		await interaction.respond(
			filtered.map(choice => ({ name: choice, value: choice })),
		);
  },
});

export {skillBuilder};
export default skill;
