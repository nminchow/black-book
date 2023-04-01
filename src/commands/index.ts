import { ClientAndCommands } from "../bot";
import skill, { skillBuilder } from "./skill";
import codex, { codexBuilder } from "./codex";
import about, { aboutBuilder } from "./about";
import invite, { inviteBuilder } from "./invite";

export const commands = {
  builders: [
    skillBuilder,
    codexBuilder,
    aboutBuilder,
    inviteBuilder,
  ],
  installer: (client: ClientAndCommands) => {
    const skillCommand = skill();
    const codexCommand = codex();
    const aboutCommand = about();
    const inviteCommand = invite();
    [skillCommand, codexCommand, aboutCommand, inviteCommand].map(command => {
      client.commands.set(command.name, command);
    })
  }
}
