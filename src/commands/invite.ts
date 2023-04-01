import {
  CacheType,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js';
import inviteViewBuilder from '../views/invite';

const name = 'invite';

const inviteBuilder = new SlashCommandBuilder()
  .setName(name)
  .setDescription(`get the bot's invite link and add it to other servers`);

const invite = () => ({
  name,
  execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
    const aboutView = inviteViewBuilder();
    interaction.reply({embeds: [aboutView]});
  },
});

export {inviteBuilder};
export default invite;
