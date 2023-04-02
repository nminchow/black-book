import { ClientAndCommands } from "../bot";
import skill, { skillBuilder } from "./skill";
import codex, { codexBuilder } from "./codex";
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
];

export const commands = {
  builders,
  installer: (client: ClientAndCommands) => {
    const skillCommand = skill();
    const codexCommand = codex();
    const aboutCommand = about();
    const inviteCommand = invite();
    const helpCommand = help(builders);
    [skillCommand, codexCommand, aboutCommand, inviteCommand, helpCommand].map(command => {
      client.commands.set(command.name, command);
    })
  }
}
