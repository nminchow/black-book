import { APIEmbed } from "discord.js";
import { RawEventResponse } from "../utility/getEvents";
import { author } from "./shared";
import { Locales } from "../i18n/i18n-types";
import L from "../i18n/i18n-node";

const helltideValue = ({ helltide: { timestamp } }: RawEventResponse) => {
  const nextStart = timestamp + 8100;
  return `Current/Previous: <t:${timestamp}:R>\nNext:<t:${nextStart}:R>`;
};

const bossValue = ({ boss: { expected, expectedName, nextExpected, nextExpectedName } }: RawEventResponse) => {
  return `Next: ${expectedName} <t:${expected}:R>\nFollowing:  ${nextExpectedName} <t:${nextExpected}:R>`;
};

const zoneEvent = ({ legion: { timestamp } }: RawEventResponse) => {
  return `Next: <t:${timestamp + 1800}:R>`;
}

const panel = (apiData: RawEventResponse, locale: Locales, willNotUpdate = false) => {
  const embed: APIEmbed = {
    title: willNotUpdate ? 'Upcoming Events' : 'World Event Status Panel',
    author,
    fields:[
      {
        name: 'World Boss',
        value: bossValue(apiData),
      },
      {
        name: 'Helltide',
        value: helltideValue(apiData),
      },
      {
        name: 'Legion',
        value: zoneEvent(apiData),
      }
    ],
  };

  if (willNotUpdate) {
    embed.footer = {
      text: `This panel will not update automatically. For an auto-updating panel, use the \`/${L[locale].commands.panel.name()}\` command.`
    }
  }
  return [embed];
};

export default panel;
