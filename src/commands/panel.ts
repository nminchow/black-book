import {
  CacheType,
  ChatInputCommandInteraction,
  PermissionsBitField,
  SlashCommandBuilder,
} from 'discord.js';
import { dbWrapper } from '../bot';
import panelView from '../views/panel';
import { getEvents } from '../utility/getEvents';
import { LocaleMappingEntry } from '../i18n/type-transformer';

const name = 'panel';

const panelBuilder = new SlashCommandBuilder()
  .setName(name)
  .setDescription('create a panel to show world event times')

const getGuildId = (interaction: ChatInputCommandInteraction<CacheType>) => {
  if (!interaction.channel || !interaction.channel?.isTextBased()) {
    return null;
  }
  if (interaction.channel?.isDMBased()) {
    return interaction.channel.id;
  }
  return interaction.guild?.id;
}




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




    const initialReply = interaction.reply('creating...');

    const updateReply = async (message: string) => {
      await initialReply;
      interaction.editReply(message);
    };

    const events = await getEvents();
    if (!events) {
      updateReply('error fetching events, panel not created. If this persists, please let us know in the support server!')
      return;
    }

    const embeds = panelView(events, locale.locale);

    const message = await interaction.channel.send({ embeds });

    try {
      message.pin(); // intentionally not awaited
    } catch (e) {
      // likely just a permissions error, swallow it
    }

    const { error: upsertError } = await db
      .from('panels')
      .upsert({
        channel_id: interaction.channelId,
        guild_id: guildId,
        message_id: message.id,
        }, {
        onConflict: 'guild_id',
        ignoreDuplicates: false,
        defaultToNull: false,
      })
      .select();
    if (upsertError) {
      console.error(upsertError);
      updateReply('something went wrong!');
      return;
    }
    updateReply('panel created! If a new panel is created in this server, this one will no longer receive updates.');
  },
});

export {panelBuilder};
export default panel;
