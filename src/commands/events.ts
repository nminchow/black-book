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

const name = L.en.commands.events.name();

const hellTideOptionName = L.en.commands.events.options.helltide.name();
const hellTideOption = (option: SlashCommandBooleanOption) => option
    .setName(hellTideOptionName)
    .setDescription(L.en.commands.events.options.helltide.description());

const worldBossOptionName = L.en.commands.events.options.worldBoss.name();
const worldBossOption = (option: SlashCommandBooleanOption) => option
    .setName(worldBossOptionName)
    .setDescription(L.en.commands.events.options.worldBoss.description());

const zoneEventOptionName = L.en.commands.events.options.zoneEvent.name();
const zoneEventOption = (option: SlashCommandBooleanOption) => option
    .setName(zoneEventOptionName)
    .setDescription(L.en.commands.events.options.zoneEvent.description());

const hellTideRoleOptionName = L.en.commands.events.options.helltideRole.name();
const hellTideRoleOption = (option: SlashCommandMentionableOption) => option
    .setName(hellTideRoleOptionName)
    .setDescription(L.en.commands.events.options.helltideRole.description());

const worldBossRoleOptionName = L.en.commands.events.options.worldBossRole.name();
const worldBossRoleOption = (option: SlashCommandMentionableOption) => option
    .setName(worldBossRoleOptionName)
    .setDescription(L.en.commands.events.options.worldBossRole.description());

const zoneEventRoleOptionName = L.en.commands.events.options.zoneEventRole.name();
const zoneEventRoleOption = (option: SlashCommandMentionableOption) => option
    .setName(zoneEventRoleOptionName)
    .setDescription(L.en.commands.events.options.zoneEventRole.description());

const allEventRoleOptionName = L.en.commands.events.options.allEventRole.name();
const allEventRoleOption = (option: SlashCommandMentionableOption) => option
    .setName(allEventRoleOptionName)
    .setDescription(L.en.commands.events.options.allEventRole.description());

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
    .setDescription(L.en.commands.events.options.images.description())
    .addChoices(...imagesOptionChoices)

const deleteMessagesOptionName = L.en.commands.events.options.deleteMessages.name();
const deleteMessageOption = (option: SlashCommandBooleanOption) => option
    .setName(deleteMessagesOptionName)
    .setDescription(L.en.commands.events.options.deleteMessages.description());


const eventsBuilder = new SlashCommandBuilder()
  .setName(name)
  .setDescription(L.en.commands.events.description())
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
  execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
    if ( !db ) {
      interaction.reply('db not initialized');
      return;
    }

    if (interaction.channel && interaction.guild?.members.me && interaction.channel.isTextBased() && !interaction.channel.isDMBased()) {
      if (!interaction.guild.members.me.permissionsIn(interaction.channel).has([PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel])) {
        interaction.reply(L.en.commands.events.errors.permissions());
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

    const upsertAttributes = Object.fromEntries(Object.entries(upsert).filter(([_, v]) => v != null));

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
      interaction.reply('something went wrong!');
      return;
    }
    interaction.reply(L.en.commands.events.messages.success({
      unsub: L.en.commands.unsub.name(),
      events: L.en.commands.events.name()
    }));
  },
});

export {eventsBuilder};
export default events;
