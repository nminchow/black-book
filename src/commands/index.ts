import { ClientAndCommands } from "../bot";
import { dbWrapper } from '../utility/database';
import skill, { skillBuilder } from "./skill";
import build, { buildBuilder } from "./build";
import codex, { codexBuilder } from "./codex";
import paragon, { paragonBuilder } from "./paragon";
import about, { aboutBuilder } from "./about";
import config, { configBuilder } from "./config";
import invite, { inviteBuilder } from "./invite";
import help, { helpBuilder } from "./help";
import events, { eventsBuilder } from "./events";
import hellTide, { hellTideBuilder } from "./hellTide";
import nightmareTier, { nightmareTierBuilder } from "./nightmareTier";
import panel, { panelBuilder } from "./panel";
import season, { seasonBuilder } from "./season";
import { SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from "discord.js";
import unsub, { unsubBuilder } from "./unsub";

export type CommandBuilers = Array<Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> | SlashCommandSubcommandsOnlyBuilder>

const builders = [
  helpBuilder,
  skillBuilder,
  codexBuilder,
  eventsBuilder,
  unsubBuilder,
  panelBuilder,
  configBuilder,
  paragonBuilder,
  seasonBuilder,
  hellTideBuilder,
  nightmareTierBuilder,
  aboutBuilder,
  inviteBuilder,
  buildBuilder,
];

export const commands = {
  builders,
  installer: (db: dbWrapper,client: ClientAndCommands) => {
    const skillCommand = skill();
    const codexCommand = codex();
    const aboutCommand = about(db);
    const configCommand = config(db);
    const inviteCommand = invite();
    const paragonCommand = paragon();
    const hellTideCommand = hellTide();
    const nightmareTierCommand = nightmareTier();
    const eventsCommand = events(db);
    const unsubCommand = unsub(db);
    const helpCommand = help(builders);
    const panelCommand = panel(db);
    const seasonCommand = season();
    const buildCommand = build();
    [
      skillCommand,
      codexCommand,
      aboutCommand,
      configCommand,
      inviteCommand,
      helpCommand,
      paragonCommand,
      hellTideCommand,
      nightmareTierCommand,
      eventsCommand,
      unsubCommand,
      panelCommand,
      seasonCommand,
      buildCommand,
    ].map(command => {
      client.commands.set(command.name, command);
    })
  }
}
