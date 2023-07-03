import { APIEmbed } from "discord.js";
import { RawEventResponse } from "../utility/getEvents";
import { author } from "./shared";
import { Locales } from "../i18n/i18n-types";

const helltideValue = ({ helltide: { timestamp } }: RawEventResponse) => {
  const nextStart = timestamp + 8100;
  return `Current/Previous: <t:${timestamp}:R>\nNext:<t:${nextStart}:R>`;
};

const bossValue = ({ boss: { expected, expectedName, nextExpected, nextExpectedName } }: RawEventResponse) => {
  return `Next: <t:${expected}:R>\nFollowing:<t:${nextExpected}:R>`;
};

const zoneEvent = ({ legion: { timestamp } }: RawEventResponse) => {
  return `Next: <t:${timestamp + 1800}:R>`;
}

const panel = (apiData: RawEventResponse, locale: Locales) => {
  const embed: APIEmbed = {
    title: 'World Event Status Panel',
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
    ]
  };
  return [embed];
};

export default panel;
