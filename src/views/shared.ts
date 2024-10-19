import { APIEmbed } from "discord.js";
import { EventParams, EventType } from "../worldEvents/createListener";
import { Locales, Translation } from "../i18n/i18n-types";
import L from "../i18n/i18n-node";
import en from "../i18n/en";

export const author = {
  name: 'Diablo Black Book',
  icon_url: 'https://i.imgur.com/FM9i5r4.png',
  url: 'https://github.com/nminchow/black-book',
};

export const addTerritory = (embed: APIEmbed, event: EventParams) => {
  const territory = event.location.territory;
  if (territory) {
    embed.image = {
      url: `https://d4armory.io/img/territories/${encodeURI(territory)}.webp`,
     } ;
  };
  return embed;
};

const hellTideMapping = {
  'kehj': en.gameData.map.zones.kehjistan,
  'hawe': en.gameData.map.zones.hawezar,
  'scos': en.gameData.map.zones.scosglen,
  'frac': en.gameData.map.zones.fracturedPeaks,
  'step': en.gameData.map.zones.drySteppes,
} as {
  [key: string]: string | null;
};

const invertKeys = <T extends Object>(obj: T) => Object.fromEntries(Object.entries(obj).map(([k, v]: [unknown, string]) => [v, k as unknown as keyof T]))

const zoneKeyToLocalizedPath = invertKeys(en.gameData.map.zones);
const territoryKeyToLocalizedPath = invertKeys(en.gameData.map.territories);
const bossKeyToLocalizedPath = invertKeys(en.gameData.worldBosses);

const localizedZone = (zone: string, locale: Locales) => {
  const path = zoneKeyToLocalizedPath[zone];
  if (!path) return zone;
  return L[locale].gameData.map.zones[path]();
};

const localizedTerritory = (territory: string, locale: Locales) => {
  const path = territoryKeyToLocalizedPath[territory];
  if (!path) return territory;
  return L[locale].gameData.map.territories[path]();
}

export const localizedBoss = (boss: string, locale: Locales) => {
  const path = bossKeyToLocalizedPath[boss];
  if (!path) return boss;
  return L[locale].gameData.worldBosses[path]();
}

export const buildLocationString = (event: EventParams, locale: Locales) => {
  const { location: { zone: rawZone, territory: rawTerritory } } = event;

  const zone = localizedZone(rawZone || L.en.gameData.map.sanctuary(), locale);
  if (!rawTerritory) return zone;

  const territory = localizedTerritory(rawTerritory, locale);

  return L[locale].views.events.utility.zoneAndTerritory({ zone, territory });
};
