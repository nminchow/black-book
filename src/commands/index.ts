import { ClientAndCommands } from "../bot";
import skill, { skillBuilder } from "./skill";
import codex, { codexBuilder } from "./codex";
import paragon, { paragonBuilder } from "./paragon";
import about, { aboutBuilder } from "./about";
import invite, { inviteBuilder } from "./invite";
import help, { helpBuilder } from "./help";
import { SlashCommandBuilder } from "discord.js";

export type CommandBuilers = Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">[]

const builders = [
  skillBuilder,
  codexBuilder,
  aboutBuilder,
  inviteBuilder,
  helpBuilder,
  paragonBuilder,
];

export const commands = {
  builders,
  installer: (client: ClientAndCommands) => {
    const skillCommand = skill();
    const codexCommand = codex();
    const aboutCommand = about();
    const inviteCommand = invite();
    const paragonCommand = paragon();
    const helpCommand = help(builders);
    [skillCommand, codexCommand, aboutCommand, inviteCommand, helpCommand, paragonCommand].map(command => {
      client.commands.set(command.name, command);
    })
  }
}
