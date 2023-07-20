import {
  CacheType,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js';
import inviteViewBuilder from '../views/invite';
import L from '../i18n/i18n-node';
import { commandLocaleMapping } from '../i18n/type-transformer';

const name = L.en.commands.invite.name();

const inviteBuilder = new SlashCommandBuilder()
  .setName(name)
  .setNameLocalizations(commandLocaleMapping.invite.name)
  .setDescription(L.en.commands.invite.description())
  .setDescriptionLocalizations(commandLocaleMapping.invite.description);

const invite = () => ({
  name,
  execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
    const aboutView = inviteViewBuilder();
    await interaction.reply({embeds: [aboutView]});
  },
});

export {inviteBuilder};
export default invite;
