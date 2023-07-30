import { Locale } from "discord.js";
import { ClientAndCommands, dbWrapper } from "../bot";
import panel from "../views/panel";
import { getLocales } from "../worldEvents/createListener";
import { getEvents } from "./getEvents";
import { parseLocaleString } from "../i18n/type-transformer";
import { toErrorWithMessage } from "./errorHelper";

const expectedErrors = [
  'Unknown Message',
  'Missing Access'
];

const deletePanelRecord = async (id: number, db: NonNullable<dbWrapper>) => {
  const { error } = await db.from('panels').delete().filter('id', 'eq', id);
  if (error) {
    console.error('error deleting panel');
    console.error(error);
  }
}


const updatePanels = async (client: ClientAndCommands, db: NonNullable<dbWrapper>) => {
  const events = await getEvents();

  if(!events) {
    console.error('could not fetch events, panel update failed');
    return;
  }

  const { data, error } = await db.from('panels')
    .select();

  if (error) {
    console.error('error fetching panel data');
    return;
  }

  const locales = await getLocales(db);

  data.map(async ({ channel_id, message_id, guild_id, id }) => {
    try {
      const channel = client.channels.cache.get(channel_id);
      if (!channel || !channel.isTextBased()) return;
      const message = await channel.messages.fetch(message_id);

      const locale = parseLocaleString(locales[guild_id] || Locale.EnglishUS);

      const embeds = panel(events, locale);

      message.edit({embeds});
    } catch (error) {
      const errorWithMessage = toErrorWithMessage(error);
      if(expectedErrors.some(x => errorWithMessage.message === x)) {
        console.error(`deleting panel for ${guild_id}`);
        await deletePanelRecord(id, db);
      } else {
        console.error(`Error updating panel for guild ${guild_id}`);
        console.error(error);
      }
    }
  });
};


export default updatePanels
