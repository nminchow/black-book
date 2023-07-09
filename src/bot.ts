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
  Locale,
  Options,
} from 'discord.js';
import { createClient } from '@supabase/supabase-js'
import {Database} from './types/supabase';
import {commands} from './commands';
import { createListener } from './worldEvents/createListener';
import { createStatsHook } from './utility/postStats';
import { getGuildIdForInteraction } from './utility/database';
import { LocaleMappingEntry, localeMapping, parseLocale } from './i18n/type-transformer';

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
    interaction: ChatInputCommandInteraction<CacheType>,
    locale: LocaleMappingEntry,
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

const client = new ClientAndCommands({
  intents: [GatewayIntentBits.Guilds],
  shards: 'auto',
  makeCache: Options.cacheWithLimits({
    ...Options.DefaultMakeCacheSettings,
    AutoModerationRuleManager: 0,
    GuildEmojiManager: 0,
    GuildBanManager: 0,
    GuildForumThreadManager: 0,
    GuildInviteManager: 0,
    GuildScheduledEventManager: 0,
    GuildStickerManager: 0,
    GuildTextThreadManager: 0,
    PresenceManager: 0,
    ReactionManager: 0,
    ReactionUserManager: 0,
    StageInstanceManager: 0,
    ThreadManager: 0,
    ThreadMemberManager: 0,
    UserManager: 0,
    VoiceStateManager: 0,
  }),
  sweepers: {
    ...Options.DefaultSweeperSettings,
    messages: {
      interval: 3600,
      lifetime: 3600
    }
  }
});

createStatsHook(client);

const getLocaleForGuild = async (interaction: ChatInputCommandInteraction<CacheType>) => {
  if (!db) return localeMapping[Locale.EnglishUS];
  const id = getGuildIdForInteraction(interaction);
  if (!id) {
    console.log('missing guild id on interaction');
    return localeMapping[Locale.EnglishUS];
  }
  const { data, error } = await db.from('guilds').select().filter('guild_id','eq', id).limit(1);

  if (error) {
    console.error('error looking up guild');
    console.error(error);
  }

  if (!data || !data[0]) return localeMapping[Locale.EnglishUS];
  return parseLocale(data[0].locale);
};

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

  const locale = await getLocaleForGuild(interaction);

  try {
    await command.execute(interaction, locale);
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

let lastEncounteredLimit = new Date();

client.rest.on('rateLimited', (event)=> {
  if (lastEncounteredLimit > new Date()) return;
  console.warn('rate limit encountered!');
  console.warn(JSON.stringify(event.timeToReset));
  const tenFromNow = new Date();
  tenFromNow.setSeconds(tenFromNow.getSeconds() + 10);
  lastEncounteredLimit = tenFromNow;
});

client.login(token);
