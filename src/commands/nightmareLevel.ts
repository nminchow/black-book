import {
  CacheType,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  SlashCommandIntegerOption,
} from 'discord.js';
import L from '../i18n/i18n-node';
import { commandLocaleMapping } from '../i18n/type-transformer';

const name = L.en.commands.nightmareLevel.name();
const description = L.en.commands.nightmareLevel.description();

const levelOptionName = L.en.commands.nightmareLevel.options.level.name();
const levelOption = (option: SlashCommandIntegerOption) => option
  .setName(levelOptionName)
  .setNameLocalizations(commandLocaleMapping.nightmareLevel.options.level.name)
  .setDescription(L.en.commands.nightmareLevel.options.level.description())
  .setDescriptionLocalizations(commandLocaleMapping.nightmareLevel.options.level.description)
  .setRequired(true);

const worldTierOptionName = L.en.commands.nightmareLevel.options.worldTier.name();
const worldTierOption = (option: SlashCommandIntegerOption) => option
  .setName(worldTierOptionName)
  .setNameLocalizations(commandLocaleMapping.nightmareLevel.options.worldTier.name)
  .setDescription(L.en.commands.nightmareLevel.options.worldTier.description())
  .setDescriptionLocalizations(commandLocaleMapping.nightmareLevel.options.worldTier.description);

const nightmareLevelBuilder = new SlashCommandBuilder()
  .setName(name)
  .setNameLocalizations(commandLocaleMapping.nightmareLevel.name)
  .setDescription(description)
  .setDescriptionLocalizations(commandLocaleMapping.nightmareLevel.description)
  .addIntegerOption(levelOption)
  .addIntegerOption(worldTierOption);

const nightmareTier = () => ({
  name,
  execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
    const levelRaw = interaction.options.getInteger(levelOptionName);
    const worldTierRaw = interaction.options.getInteger(worldTierOptionName);

    const level = (levelRaw || 50);
    const worldTier = (worldTierRaw || 4);

    const targetLevel = level + 3;

    const sigil = targetLevel - 50 - worldTier;

    interaction.reply(`Sigil tier ${sigil} will yield enemies at level ${targetLevel}. For a level ${level} character, running higher level sigils will grant additional xp, but take longer to clear and won't grant as great an advantage per level.`);
  },
});

export {nightmareLevelBuilder};
export default nightmareTier;
