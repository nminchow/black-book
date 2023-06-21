import {
  CacheType,
  ChatInputCommandInteraction,
  SlashCommandBooleanOption,
  SlashCommandBuilder,
  SlashCommandMentionableOption,
  SlashCommandStringOption,
} from 'discord.js';
import { dbWrapper } from '../bot';
import { deleteSubs } from './unsub';

const name = 'events';

const hellTideOptionName = 'helltide';
const hellTideOption = (option: SlashCommandBooleanOption) => option
    .setName(hellTideOptionName)
    .setDescription(`receive alerts on upcoming helltides (defaults to 'true')`);

const worldBossOptionName = 'world-boss';
const worldBossOption = (option: SlashCommandBooleanOption) => option
    .setName(worldBossOptionName)
    .setDescription(`receive alerts on upcoming world bosses (defaults to 'true')`);

const zoneEventOptionName = 'zone-event';
const zoneEventOption = (option: SlashCommandBooleanOption) => option
    .setName(zoneEventOptionName)
    .setDescription(`receive alerts on upcoming zone events (defaults to 'false')`);

const hellTideRoleOptionName = 'helltide-role'
const hellTideRoleOption = (option: SlashCommandMentionableOption) => option
    .setName(hellTideRoleOptionName)
    .setDescription('set user or role to be alerted on upcoming helltides');

const worldBossRoleOptionName = 'world-boss-role'
const worldBossRoleOption = (option: SlashCommandMentionableOption) => option
    .setName(worldBossRoleOptionName)
    .setDescription('set user or role to be alerted on upcoming world bosses');

const zoneEventRoleOptionName = 'zone-event-role'
const zoneEventRoleOption = (option: SlashCommandMentionableOption) => option
    .setName(zoneEventRoleOptionName)
    .setDescription('set user or role to be alerted on upcoming zone events');

const allEventRoleOptionName = 'all-event-role';
const allEventRoleOption = (option: SlashCommandMentionableOption) => option
    .setName(allEventRoleOptionName)
    .setDescription('set user or role to be alerted on all events');


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

const imagesOptionName = 'show-images';
const imagesOption = (option: SlashCommandStringOption) => option
    .setName(imagesOptionName)
    .setDescription('show images in alerts')
    .addChoices(...imagesOptionChoices)

const deleteMessagesOptionName = 'delete-expired-events';
const deleteMessageOption = (option: SlashCommandBooleanOption) => option
    .setName(deleteMessagesOptionName)
    .setDescription('delete event notifications from the channel after the event has ended');


const eventsBuilder = new SlashCommandBuilder()
  .setName(name)
  .setDescription('get updates on helltides and world bosses')
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
    return { zoneAndBossNotify: true, helltideNotify: true };
  }
  if ( choice === imagesOptionChoices[1].value ) {
    return { zoneAndBossNotify: false, helltideNotify: true };
  }
  if ( choice === imagesOptionChoices[2].value ) {
    return { zoneAndBossNotify: false, helltideNotify: false };
  }
  return { zoneAndBossNotify: null, helltideNotify: null };
}

const events = (db: dbWrapper) => ({
  name,
  execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
    if ( !db ) {
      interaction.reply('db not initialized');
      return;
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

    const { zoneAndBossNotify, helltideNotify } = getImageOptions(imageSetting);

    const upsert = {
      helltide: hellTideEnabled,
      worldboss: worldBossEnabled,
      zoneevent: zoneEventEnabled,
      role: allEventRole?.toString(),
      boss_role: worldBossRole?.toString(),
      helltide_role: hellTideRole?.toString(),
      event_role: zoneEventRole?.toString(),
      auto_delete: deleteEvents,
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
    interaction.reply('events will be posted in this channel! Use `/unsub` to stop event posts here. Use the `/events` command again to change your configuration.');
  },
});

export {eventsBuilder};
export default events;
