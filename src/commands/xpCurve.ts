import {
  CacheType,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js';
import xpCurveViewBuilder from '../views/xpCurve';

const name = 'xp-curve';
const description = 'show info about xp and the leveling curve';

const xpCurveBuilder = new SlashCommandBuilder()
  .setName(name)
  .setDescription(description);

const xpCurve = () => ({
  name,
  execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
    const aboutView = xpCurveViewBuilder();
    interaction.reply({embeds: [aboutView]});
  },
});

export {xpCurveBuilder};
export default xpCurve;
