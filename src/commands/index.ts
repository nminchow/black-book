import { ClientAndCommands } from "../bot";
import skill, { skillBuilder } from "./skill";
import codex, { codexBuilder } from "./codex";
import about, { aboutBuilder } from "./about";

export const commands = {
  builders: [
    skillBuilder,
    codexBuilder,
    aboutBuilder
  ],
  installer: (client: ClientAndCommands) => {
    const skillCommand = skill();
    const codexCommand = codex();
    const aboutCommand = about();
    [skillCommand, codexCommand, aboutCommand].map(command => {
      client.commands.set(command.name, command);
    })
  }
}
