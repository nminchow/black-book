import { Locale } from "discord.js";
import { ClientAndCommands, dbWrapper } from "../bot";
import panel from "../views/panel";
import { getLocales } from "../worldEvents/createListener";
import { getEvents } from "./getEvents";
import { parseLocaleString } from "../i18n/type-transformer";

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

  data.map(async ({ channel_id, message_id, guild_id }) => {
    try {
      const channel = client.channels.cache.get(channel_id);
      if (!channel || !channel.isTextBased()) return;
      const message = await channel.messages.fetch(message_id);

      const locale = parseLocaleString(locales[guild_id] || Locale.EnglishUS);

      const embeds = panel(events, locale);

      message.edit({embeds});
    } catch (error) {
      console.error('error editing panel');
      console.error(error);
    }
  });
};


export default updatePanels
