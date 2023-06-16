import { ClientAndCommands, dbWrapper } from "../bot";
import skill, { skillBuilder } from "./skill";
import codex, { codexBuilder } from "./codex";
import paragon, { paragonBuilder } from "./paragon";
import about, { aboutBuilder } from "./about";
import config, { configBuilder } from "./config";
import invite, { inviteBuilder } from "./invite";
import help, { helpBuilder } from "./help";
import events, { eventsBuilder } from "./events";
import hellTide, { hellTideBuilder } from "./hellTide";
import { SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from "discord.js";
import unsub, { unsubBuilder } from "./unsub";

export type CommandBuilers = Array<Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> | SlashCommandSubcommandsOnlyBuilder>

const builders = [
  helpBuilder,
  skillBuilder,
  codexBuilder,
  eventsBuilder,
  unsubBuilder,
  configBuilder,
  paragonBuilder,
  hellTideBuilder,
  aboutBuilder,
  inviteBuilder,
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
    const eventsCommand = events(db);
    const unsubCommand = unsub(db);
    const helpCommand = help(builders);
    [
      skillCommand,
      codexCommand,
      aboutCommand,
      configCommand,
      inviteCommand,
      helpCommand,
      paragonCommand,
      hellTideCommand,
      eventsCommand,
      unsubCommand,
    ].map(command => {
      client.commands.set(command.name, command);
    })
  }
}
