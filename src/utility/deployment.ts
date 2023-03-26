import inquirer from 'inquirer';
import {REST, Routes} from 'discord.js';
import { commands } from '../commands/index';

interface RestResponse {
  length: number;
}

const clientId = process.env.DISCORD_CLIENT_ID;
const guildId = process.env.DISCORD_GUILD_ID;
const token = process.env.DISCORD_TOKEN;

if (!token || !clientId) {
  throw 'Please ensure a token and clientId are set in the environment!';
}

const ensureProdDeploy = {
  type: 'list',
  name: 'confirm',
  message: 'No guild Id detected. Deploy globally?',
  choices: ['No', 'Yes'],
};

const prompts = !guildId ? [ensureProdDeploy] : [];

const rest = new REST({version: '10'}).setToken(token);

const commandBody = commands.builders.map(x => x.toJSON());

const commandsInstaller = (clientId: string, guildId?: string) => {
  if (guildId) {
    return Routes.applicationGuildCommands(clientId, guildId);
  }
  return Routes.applicationCommands(clientId);
};

inquirer.prompt(prompts).then(async answers => {
  if (answers?.confirm === 'No') return;
  console.log('doing deploy!');
  try {
    console.log(
      `Started refreshing ${commandBody.length} application (/) commands.`
    );

    const request = commandsInstaller(clientId, guildId);

    const data = (await rest.put(request, {body: commandBody})) as RestResponse;

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`
    );
    return;

  } catch (error) {
    console.error(error);
  }
});
