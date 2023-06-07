import { ClientAndCommands } from "../bot";
import skill, { skillBuilder } from "./skill";
import codex, { codexBuilder } from "./codex";
import paragon, { paragonBuilder } from "./paragon";
import about, { aboutBuilder } from "./about";
import invite, { inviteBuilder } from "./invite";
import help, { helpBuilder } from "./help";
import hellTide, { hellTideBuilder } from "./hellTide";
import { SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from "discord.js";

export type CommandBuilers = Array<Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> | SlashCommandSubcommandsOnlyBuilder>

const builders = [
  skillBuilder,
  codexBuilder,
  aboutBuilder,
  inviteBuilder,
  helpBuilder,
  paragonBuilder,
  hellTideBuilder,
];

export const commands = {
  builders,
  installer: (client: ClientAndCommands) => {
    const skillCommand = skill();
    const codexCommand = codex();
    const aboutCommand = about();
    const inviteCommand = invite();
    const paragonCommand = paragon();
    const hellTideCommand = hellTide();
    const helpCommand = help(builders);
    [
      skillCommand,
      codexCommand,
      aboutCommand,
      inviteCommand,
      helpCommand,
      paragonCommand,
      hellTideCommand
    ].map(command => {
      client.commands.set(command.name, command);
    })
  }
}
