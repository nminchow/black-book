import {APIEmbed, CacheType, ChatInputCommandInteraction} from 'discord.js';
import { author } from './shared';
import { dbWrapper } from '../bot';
import { SubRecord } from '../worldEvents/createListener';

const query = (interaction: ChatInputCommandInteraction<CacheType>, db: NonNullable<dbWrapper>) => {
  if (interaction.guildId == null) {
    console.log('was dm based');
    return db.from('subscriptions').select().filter('channel_id', 'eq', interaction.channelId);
  }
  return db.from('subscriptions').select().filter('guild_id', 'eq', interaction.guildId);
}

type SubResponse = SubRecord[] | null;

const getDescription = (data: SubResponse) => {
  if (!data || data.length === 0) {
    return "Events are not being sent to any channels. Use `/events` to start getting alerts!"
  }

  const eventText = data.map(x => `<#${x.channel_id}>:
    Helltides: ${x.helltide} - ${x.helltide_role}
    World Bosses: ${x.worldboss} - ${x.boss_role}
    Zone Events: ${x.zoneevent} - ${x.event_role}
    All Events Role: ${x.role}`).join('\n\n');

  return `The following channels are listening for events. 'true' or 'false' indicates if events of that type will be sent. The role following the event type will also be mentioned.
  \n${eventText}`;
}

const about = async (interaction: ChatInputCommandInteraction<CacheType>, db: NonNullable<dbWrapper>) => {
  const { data } = await query(interaction, db);
  const description = getDescription(data);

  const embed: APIEmbed = {
    author,
    description,
  };

  return embed;
};

export default about;
