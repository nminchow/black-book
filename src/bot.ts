import {
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  ClientOptions,
  ChatInputCommandInteraction,
  CacheType,
  ActivityType,
  AutocompleteInteraction,
} from 'discord.js';
import { createClient } from '@supabase/supabase-js'
import {Database} from './types/supabase';
import {commands} from './commands';
import { createListener } from './worldEvents/createListener';

const token = process.env.DISCORD_TOKEN;

if (!token) {
  throw 'discord token not found';
}

const dbClient = () => {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseServiceRoleKey || !supabaseUrl) {
    console.log('no supabase config found - event tracking disabled');
    return null;
  }

  return createClient<Database>(supabaseUrl, supabaseServiceRoleKey, { auth: { persistSession: false } })
};

const db = dbClient();

export type dbWrapper = typeof db;

interface CommandHandler {
  name: string;
  execute: (
    interaction: ChatInputCommandInteraction<CacheType>
  ) => Promise<void>;
  autocomplete?: (
    interaction: AutocompleteInteraction<CacheType>
  ) => Promise<void>;
}

export class ClientAndCommands extends Client {
  public commands: Collection<String, CommandHandler>;
  constructor(options: ClientOptions) {
    super(options);
    this.commands = new Collection();
    this.loadCommands();
  }
  private loadCommands(): void {
    commands.installer(db, this);
  }
}


const client = new ClientAndCommands({intents: [GatewayIntentBits.Guilds]});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand() && !interaction.isAutocomplete()) return;

  const myClient = interaction.client as ClientAndCommands;

  const command = myClient.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  if (interaction.isAutocomplete()) {
    if (!command.autocomplete) {
      console.log('bad autocomplete call')
      return;
    }
    try {
      await command.autocomplete(interaction);
    } catch(error) {
      console.error(error);
    }
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: 'There was an error while executing this command!',
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: 'There was an error while executing this command!',
        ephemeral: true,
      });
    }
  }
});

client.on(Events.ClientReady, async () => {
  createListener(client, db);
  client.user?.setActivity('/help', {type: ActivityType.Watching});
});


client.login(token);
