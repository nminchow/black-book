import {
  CacheType,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js';
import hellTideViewBuilder from '../views/hellTide';

const name = 'hell-tide';
// const subCommand = 'tide';
const description = 'display map and info about hell tides';

const hellTideBuilder = new SlashCommandBuilder()
  .setName(name)
  .setDescription(description);
  // .addSubcommand(subcommand =>
  //   subcommand
  //     .setName(subCommand)
  //     .setDescription(description));

const hellTide = () => ({
  name,
  execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
    const aboutView = hellTideViewBuilder();
    interaction.reply({embeds: [aboutView]});
  },
});

export {hellTideBuilder};
export default hellTide;
