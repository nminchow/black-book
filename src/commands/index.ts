import { ClientAndCommands } from "../bot";
import skill, { skillBuilder } from "./skill";

export const commands = {
  builders: [
    skillBuilder,
  ],
  installer: (client: ClientAndCommands) => {
    const skillCommand = skill();
    [skillCommand].map(command => {
      client.commands.set(command.name, command);
    })
  }
}
