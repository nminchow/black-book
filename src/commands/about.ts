import {
  CacheType,
  ChatInputCommandInteraction,
  InteractionEditReplyOptions,
  SlashCommandBuilder,
} from 'discord.js';
import aboutViewBuilder from '../views/about';
import { dbWrapper } from '../utility/database';
import L from '../i18n/i18n-node';
import { commandLocaleMapping } from '../i18n/type-transformer';

const name = L.en.commands.about.name();

const aboutBuilder = new SlashCommandBuilder()
  .setName(name)
  .setNameLocalizations(commandLocaleMapping.about.name)
  .setDescription(L.en.commands.about.description())
  .setDescriptionLocalizations(commandLocaleMapping.about.description);

const about = (db: dbWrapper) => ({
  name,
  execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
    const initialReply = interaction.deferReply();
    const updateReply = async (message: InteractionEditReplyOptions) => {
      await initialReply;
      interaction.editReply(message);
    };
    const aboutView = await aboutViewBuilder(interaction, db);
    await updateReply({embeds: [aboutView]});
  },
});

export {aboutBuilder};
export default about;
