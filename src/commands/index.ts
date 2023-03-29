import { ClientAndCommands } from "../bot";
import skill, { skillBuilder } from "./skill";
import codex, { codexBuilder } from "./codex";

export const commands = {
  builders: [
    skillBuilder,
    codexBuilder,
  ],
  installer: (client: ClientAndCommands) => {
    const skillCommand = skill();
    const codexCommand = codex();
    [skillCommand, codexCommand].map(command => {
      client.commands.set(command.name, command);
    })
  }
}
