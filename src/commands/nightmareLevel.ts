import {
  CacheType,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  SlashCommandIntegerOption,
} from 'discord.js';

const name = 'nightmare-level';
const description = 'calculate the optimal nightmare dungeon level for your character';

const levelOptionName = 'level';
const levelOption = (option: SlashCommandIntegerOption) => option
  .setName(levelOptionName)
  .setDescription(`your character level`)
  .setRequired(true);

const worldTierOptionName = 'world-tier'
const worldTierOption = (option: SlashCommandIntegerOption) => option
  .setName(worldTierOptionName)
  .setDescription(`your world tier (defaults to 4)`);

const nightmareLevelBuilder = new SlashCommandBuilder()
  .setName(name)
  .setDescription(description)
  .addIntegerOption(levelOption)
  .addIntegerOption(worldTierOption)

const nightmareTier = () => ({
  name,
  execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
    const levelRaw = interaction.options.getInteger(levelOptionName);
    const worldTierRaw = interaction.options.getInteger(worldTierOptionName);

    const level = (levelRaw || 50);
    const worldTier = (worldTierRaw || 4);

    const targetLevel = level + 3;

    const sigil = targetLevel - 50 - worldTier;

    interaction.reply(`Sigil tier ${sigil} will yield enemies at level ${targetLevel}. Running higher level sigils will grant additional xp, but take longer to clear and won't grant as great an advantage per level.`);
  },
});

export {nightmareLevelBuilder};
export default nightmareTier;
