import { APIEmbed } from "discord.js";
import { EventResponse } from "../worldEvents/createListener";

export const author = {
  name: 'Diablo Black Book',
  icon_url: 'https://i.imgur.com/FM9i5r4.png',
  url: 'https://github.com/nminchow/black-book',
};

export const addTerritory = (embed: APIEmbed, event: EventResponse) => {
  const [territory] = event.location.split(',');
  if (territory) {
    embed.image = {
      url: `https://d4armory.io/img/territories/${encodeURI(territory)}.webp`,
     } ;
  };
  return embed;
};
