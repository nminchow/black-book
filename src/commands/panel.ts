import {
  CacheType,
  ChatInputCommandInteraction,
  PermissionsBitField,
  SlashCommandBuilder,
  SlashCommandMentionableOption,
} from 'discord.js';
import { dbWrapper } from '../bot';
import panelView from '../views/panel';
import { getEvents } from '../utility/getEvents';
import { LocaleMappingEntry } from '../i18n/type-transformer';

const name = 'panel';

const hellTideRoleOptionName = 'helltide-role'
const hellTideRoleOption = (option: SlashCommandMentionableOption) => option
    .setName(hellTideRoleOptionName)
    .setDescription('override the helltide notificaitons role assigned with the interaciton button');

const worldBossRoleOptionName = 'world-boss-role'
const worldBossRoleOption = (option: SlashCommandMentionableOption) => option
    .setName(worldBossRoleOptionName)
    .setDescription('override the world boss notificaions role assigned with the interaciton button');

const zoneEventRoleOptionName = 'zone-event-role'
const zoneEventRoleOption = (option: SlashCommandMentionableOption) => option
    .setName(zoneEventRoleOptionName)
    .setDescription('override the zone event notifications role assigned with the interaciton button');

const allEventRoleOptionName = 'all-event-role';
const allEventRoleOption = (option: SlashCommandMentionableOption) => option
    .setName(allEventRoleOptionName)
    .setDescription('override the role for all event notifications assigned with the interaciton button');



const panelBuilder = new SlashCommandBuilder()
  .setName(name)
  .setDescription('create a panel to show world event times')
  .addMentionableOption(hellTideRoleOption)
  .addMentionableOption(worldBossRoleOption)
  .addMentionableOption(zoneEventRoleOption)
  .addMentionableOption(allEventRoleOption)

const getGuildId = (interaction: ChatInputCommandInteraction<CacheType>) => {
  if (!interaction.channel || !interaction.channel?.isTextBased()) {
    return null;
  }
  if (interaction.channel?.isDMBased()) {
    return interaction.channel.id;
  }
  return interaction.guild?.id;
}

type RoleTemplate = {
  boss_role: null | string,
  helltide_role: null | string,
  event_role: null | string,
  role: null | string,
}

const getCurrentRoles = async (guildId: string, db: NonNullable<dbWrapper>) => {
  const { data, error } = await db.from('subscriptions')
    .select()
    .filter('guild_id', 'eq', guildId)
    .order('created_at', { ascending: true });

  if (error) {
    throw 'error fetching roles for panel!';
  }

  return data.reduce((acc, { boss_role, helltide_role, event_role, role }) => {
    return ({
      boss_role: boss_role || acc.boss_role,
      helltide_role: helltide_role || acc.helltide_role,
      event_role: event_role || acc.event_role,
      role: role || acc.event_role,
    })
  },{
    boss_role: null,
    helltide_role: null,
    event_role: null,
    role: null,
  } as RoleTemplate);
};


const panel = (db: dbWrapper) => ({
  name,
  execute: async (interaction: ChatInputCommandInteraction<CacheType>, locale: LocaleMappingEntry) => {
    if ( !db ) {
      interaction.reply('db not initialized');
      return;
    }

    if (!interaction.channel || !interaction.channel.isTextBased()) {
      interaction.reply('panels can only be created in text channels');
      return;
    }

    if (interaction.guild?.members.me && !interaction.channel.isDMBased()) {
      if (!interaction.guild.members.me.permissionsIn(interaction.channel).has([PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel])) {
        interaction.reply(`The bot doesn't currently have the "Send Messages" and "View Messages" permission for this channel, so alerts can't be sent. Once permissions are enabled, rerun this command!`);
        return;
      }
    }

    const guildId = getGuildId(interaction);

    if (!guildId) {
      console.error('could not find guildID for command');
      interaction.reply(`we couldn't find a server for this panel. If this persists, please let us know in the support server!`);
      return;
    }

    const rolePrediction = await getCurrentRoles(guildId, db);

    const hellTideRole = interaction.options.getMentionable(hellTideRoleOptionName);
    const worldBossRole = interaction.options.getMentionable(worldBossRoleOptionName);
    const zoneEventRole = interaction.options.getMentionable(zoneEventRoleOptionName);
    const allEventRole = interaction.options.getMentionable(allEventRoleOptionName);

    const upsert = {
      boss_role: (worldBossRole || rolePrediction.boss_role)?.toString(),
      helltide_role: (hellTideRole || rolePrediction.helltide_role)?.toString(),
      event_role: (zoneEventRole || rolePrediction.event_role)?.toString(),
      role: (allEventRole || rolePrediction.role)?.toString(),
    };

    const upsertAttributes = Object.fromEntries(Object.entries(upsert).filter(([_, v]) => v != null));

    const events = await getEvents();
    if (!events) {
      interaction.reply('error fetching events, panel not created. If this persists, please let us know in the support server!')
      return;
    }

    const embeds = panelView(events, locale.locale);

    const message = await interaction.channel.send({ embeds });

    const { error: upsertError } = await db
      .from('panels')
      .upsert({
        channel_id: interaction.channelId,
        guild_id: guildId,
        message_id: message.id,
        ...upsertAttributes
        }, {
        onConflict: 'guild_id',
        ignoreDuplicates: false,
        defaultToNull: false,
      })
      .select();
    if (upsertError) {
      console.error(upsertError);
      interaction.reply('something went wrong!');
      return;
    }
    interaction.reply('panel created! If a new panel is created in this server, this one will no longer receive updates.');
  },
});

export {panelBuilder};
export default panel;
