import {
  CacheType,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js';
import nightmareTierViewBuilder from '../views/nightmareTier';

const name = 'nightmare-tiers';
// const subCommand = 'tide';
const description = 'display an efficiency tierlist of nightmare dungeons';

const nightmareTierBuilder = new SlashCommandBuilder()
  .setName(name)
  .setDescription(description);

const nightmareTier = () => ({
  name,
  execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
    const aboutView = nightmareTierViewBuilder();
    interaction.reply({embeds: [aboutView]});
  },
});

export {nightmareTierBuilder};
export default nightmareTier;
