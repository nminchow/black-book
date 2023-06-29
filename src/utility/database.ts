import { CacheType, ChatInputCommandInteraction } from "discord.js";

export const filterNulls = (entries: { [s: string]: unknown; } | ArrayLike<unknown>) => Object.fromEntries(Object.entries(entries).filter(([_, v]) => v != null));

export const getGuildIdForInteraction = (interaction: ChatInputCommandInteraction<CacheType>) => {
  if (!interaction.channel) return null;
  if (interaction.channel.isDMBased()) return interaction.channelId;
  return interaction.channel.guildId;
};
