import {
  CacheType,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  AutocompleteInteraction
} from 'discord.js';
import combinedSkills, { skillFuse } from '../data/skillDatabase';
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

    const skillView = await skillViewBuilder(skill);
    interaction.reply({embeds: [skillView]});
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
