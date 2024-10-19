import { createClient } from "@supabase/supabase-js";
import { CacheType, ChatInputCommandInteraction } from "discord.js";
import { Database } from "../types/supabase";
import { db } from '../bot';

export const filterNulls = (entries: { [s: string]: unknown; } | ArrayLike<unknown>) => Object.fromEntries(Object.entries(entries).filter(([_, v]) => v != null));

export const getGuildIdForInteraction = (interaction: ChatInputCommandInteraction<CacheType>) => {
  if (!interaction.channel) return null;
  if (interaction.channel.isDMBased()) return interaction.channelId;
  return interaction.channel.guildId;
};

export const dbClient = () => {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseServiceRoleKey || !supabaseUrl) {
    console.log('no supabase config found - event tracking disabled');
    return null;
  }

  return createClient<Database>(supabaseUrl, supabaseServiceRoleKey, { auth: { persistSession: false } })
};

export type dbWrapper = typeof db;

