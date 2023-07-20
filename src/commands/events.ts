import {
  CacheType,
  ChatInputCommandInteraction,
  PermissionsBitField,
  SlashCommandBooleanOption,
  SlashCommandBuilder,
  SlashCommandMentionableOption,
  SlashCommandStringOption,
} from 'discord.js';
import { dbWrapper } from '../bot';
import L from '../i18n/i18n-node';
import { LocaleMappingEntry, commandLocaleMapping } from '../i18n/type-transformer';
import { filterNulls } from '../utility/database';
import panelView from '../views/panel';
import { getEvents } from '../utility/getEvents';

const name = L.en.commands.events.name();

const hellTideOptionName = L.en.commands.events.options.helltide.name();
const hellTideOption = (option: SlashCommandBooleanOption) => option
    .setName(hellTideOptionName)
    .setNameLocalizations(commandLocaleMapping.events.options.helltide.name)
    .setDescription(L.en.commands.events.options.helltide.description())
    .setDescriptionLocalizations(commandLocaleMapping.events.options.helltide.description);

const worldBossOptionName = L.en.commands.events.options.worldBoss.name();
const worldBossOption = (option: SlashCommandBooleanOption) => option
    .setName(worldBossOptionName)
    .setNameLocalizations(commandLocaleMapping.events.options.worldBoss.name)
    .setDescription(L.en.commands.events.options.worldBoss.description())
    .setDescriptionLocalizations(commandLocaleMapping.events.options.worldBoss.description);

const zoneEventOptionName = L.en.commands.events.options.zoneEvent.name();
const zoneEventOption = (option: SlashCommandBooleanOption) => option
    .setName(zoneEventOptionName)
    .setNameLocalizations(commandLocaleMapping.events.options.zoneEvent.name)
    .setDescription(L.en.commands.events.options.zoneEvent.description())
    .setDescriptionLocalizations(commandLocaleMapping.events.options.zoneEvent.description);

const hellTideRoleOptionName = L.en.commands.events.options.helltideRole.name();
const hellTideRoleOption = (option: SlashCommandMentionableOption) => option
    .setName(hellTideRoleOptionName)
    .setNameLocalizations(commandLocaleMapping.events.options.helltideRole.name)
    .setDescription(L.en.commands.events.options.helltideRole.description())
    .setDescriptionLocalizations(commandLocaleMapping.events.options.helltideRole.description);

const worldBossRoleOptionName = L.en.commands.events.options.worldBossRole.name();
const worldBossRoleOption = (option: SlashCommandMentionableOption) => option
    .setName(worldBossRoleOptionName)
    .setNameLocalizations(commandLocaleMapping.events.options.worldBossRole.name)
    .setDescription(L.en.commands.events.options.worldBossRole.description())
    .setDescriptionLocalizations(commandLocaleMapping.events.options.worldBossRole.description);

const zoneEventRoleOptionName = L.en.commands.events.options.zoneEventRole.name();
const zoneEventRoleOption = (option: SlashCommandMentionableOption) => option
    .setName(zoneEventRoleOptionName)
    .setNameLocalizations(commandLocaleMapping.events.options.zoneEventRole.name)
    .setDescription(L.en.commands.events.options.zoneEventRole.description())
    .setDescriptionLocalizations(commandLocaleMapping.events.options.zoneEventRole.description);

const allEventRoleOptionName = L.en.commands.events.options.allEventRole.name();
const allEventRoleOption = (option: SlashCommandMentionableOption) => option
    .setName(allEventRoleOptionName)
    .setNameLocalizations(commandLocaleMapping.events.options.allEventRole.name)
    .setDescription(L.en.commands.events.options.allEventRole.description())
    .setDescriptionLocalizations(commandLocaleMapping.events.options.allEventRole.description);

// TODO: localize
const imagesOptionChoices = [
  {
    name: 'images on all alerts',
    value: 'all'
  },
  {
    name: 'images only on helltide alerts',
    value: 'helltide'
  },
  {
    name: 'no images',
    value: 'none'
  }
];

const imagesOptionName = L.en.commands.events.options.images.name();
const imagesOption = (option: SlashCommandStringOption) => option
    .setName(imagesOptionName)
    .setNameLocalizations(commandLocaleMapping.events.options.images.name)
    .setDescription(L.en.commands.events.options.images.description())
    .setDescriptionLocalizations(commandLocaleMapping.events.options.images.description)
    .addChoices(...imagesOptionChoices);

const deleteMessagesOptionName = L.en.commands.events.options.deleteMessages.name();
const deleteMessageOption = (option: SlashCommandBooleanOption) => option
    .setName(deleteMessagesOptionName)
    .setNameLocalizations(commandLocaleMapping.events.options.deleteMessages.name)
    .setDescription(L.en.commands.events.options.deleteMessages.description())
    .setDescriptionLocalizations(commandLocaleMapping.events.options.deleteMessages.description);


const eventsBuilder = new SlashCommandBuilder()
  .setName(name)
  .setNameLocalizations(commandLocaleMapping.events.name)
  .setDescription(L.en.commands.events.description())
  .setDescriptionLocalizations(commandLocaleMapping.events.description)
  .addBooleanOption(hellTideOption)
  .addBooleanOption(worldBossOption)
  .addBooleanOption(zoneEventOption)
  .addMentionableOption(hellTideRoleOption)
  .addMentionableOption(worldBossRoleOption)
  .addMentionableOption(zoneEventRoleOption)
  .addMentionableOption(allEventRoleOption)
  .addStringOption(imagesOption)
  .addBooleanOption(deleteMessageOption)


const getImageOptions = (choice: string | null) => {
  if ( choice === imagesOptionChoices[0].value ) {
    return { zoneAndBossImages: true, helltideImages: true };
  }
  if ( choice === imagesOptionChoices[1].value ) {
    return { zoneAndBossImages: false, helltideImages: true };
  }
  if ( choice === imagesOptionChoices[2].value ) {
    return { zoneAndBossImages: false, helltideImages: false };
  }
  return { zoneAndBossImages: null, helltideImages: null };
}

const events = (db: dbWrapper) => ({
  name,
  execute: async (interaction: ChatInputCommandInteraction<CacheType>, locale: LocaleMappingEntry) => {
    if ( !db ) {
      await interaction.reply('db not initialized');
      return;
    }

    if (interaction.channel && interaction.guild?.members.me && interaction.channel.isTextBased() && !interaction.channel.isDMBased()) {
      if (!interaction.guild.members.me.permissionsIn(interaction.channel).has([PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.EmbedLinks])) {
        await interaction.reply(L.en.commands.events.errors.permissions());
        return;
      }
    }

    const hellTideEnabled = interaction.options.getBoolean(hellTideOptionName)
    const worldBossEnabled = interaction.options.getBoolean(worldBossOptionName)
    const zoneEventEnabled = interaction.options.getBoolean(zoneEventOptionName)
    const hellTideRole = interaction.options.getMentionable(hellTideRoleOptionName);
    const worldBossRole = interaction.options.getMentionable(worldBossRoleOptionName);
    const zoneEventRole = interaction.options.getMentionable(zoneEventRoleOptionName);
    const allEventRole = interaction.options.getMentionable(allEventRoleOptionName);
    const deleteEvents = interaction.options.getBoolean(deleteMessagesOptionName);
    const imageSetting = interaction.options.getString(imagesOptionName);

    const { zoneAndBossImages, helltideImages } = getImageOptions(imageSetting);

    const upsert = {
      helltide: hellTideEnabled,
      worldboss: worldBossEnabled,
      zoneevent: zoneEventEnabled,
      role: allEventRole?.toString(),
      boss_role: worldBossRole?.toString(),
      helltide_role: hellTideRole?.toString(),
      event_role: zoneEventRole?.toString(),
      auto_delete: deleteEvents,
      zone_and_boss_images: zoneAndBossImages,
      helltide_images: helltideImages,
    };

    const upsertAttributes = filterNulls(upsert);

    const { error: upsertError } = await db
      .from('subscriptions')
      .upsert({
        channel_id: interaction.channelId,
        guild_id: interaction.guildId || 'unknown',
        ...upsertAttributes
      }, {
        onConflict: 'channel_id, guild_id',
        ignoreDuplicates: false,
        defaultToNull: false,
      })
      .select();
    if (upsertError) {
      console.error(upsertError);
      await interaction.reply('something went wrong!');
      return;
    }
    const entries = L[locale.locale];
    await interaction.reply(entries.commands.events.messages.success({
      unsub: entries.commands.unsub.name(),
      events: entries.commands.events.name()
    }));

    const events = await getEvents();
    if (!events) {
      return;
    }

    const embeds = panelView(events, locale.locale, true);

    interaction.channel?.send({ embeds });
  },
});

export {eventsBuilder};
export default events;
