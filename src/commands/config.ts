import {
  CacheType,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  SlashCommandStringOption,
} from 'discord.js';
import configViewBuilder from '../views/config';
import { dbWrapper } from '../utility/database';
import L from '../i18n/i18n-node';
import { commandLocaleMapping, localeMapping, parseLocale } from '../i18n/type-transformer';
import { locales } from '../i18n/i18n-util';
import { filterNulls, getGuildIdForInteraction } from '../utility/database';

const name = L.en.commands.config.name();

locales

const keysToValues = Object.entries(localeMapping).map(([key, value]) => ({
  value: key,
  name: value.staticMapping.nativeName,
}));

const localeOptionName = L.en.commands.config.options.locale.name()
const localeOption = (option: SlashCommandStringOption) => option
    .setName(localeOptionName)
    .setNameLocalizations(commandLocaleMapping.config.options.locale.name)
    .setDescription(L.en.commands.config.options.locale.description())
    .addChoices(...keysToValues)

const configBuilder = new SlashCommandBuilder()
  .setName(name)
  .setNameLocalizations(commandLocaleMapping.config.name)
  .setDescription(L.en.commands.config.description())
  .setDescriptionLocalizations(commandLocaleMapping.config.description)
  .addStringOption(localeOption);

const config = (db: dbWrapper) => ({
  name,
  execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
    if ( !db ) {
      await interaction.reply('db not initialized');
      return;
    }

    const locale = interaction.options.getString(localeOptionName);

    const guildId = getGuildIdForInteraction(interaction);

    if (!guildId) {
      await interaction.reply('command not supported for channel type');
      return;
    }

    const upsert = filterNulls({ locale });

    const { error, data } = await db
      .from('guilds')
      .upsert({
        guild_id: guildId,
        ...upsert
      }, {
        onConflict: 'guild_id'
      })
      .select();

    if (!data || !data[0] || error) {
      await interaction.reply('error fetching config');
      console.error(error);
      return;
    }

    const configView = await configViewBuilder(parseLocale(data[0].locale), interaction, db);
    await interaction.reply({embeds: [configView]});
  },
});

export {configBuilder};
export default config;
