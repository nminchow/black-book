import {
  CacheType,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  AutocompleteInteraction
} from 'discord.js';
import fetch from 'node-fetch';
// import combinedSkills, { buildFuse } from '../data/buildDatabase';
// import buildViewBuilder from '../views/build';
import L from '../i18n/i18n-node';
import { commandLocaleMapping } from '../i18n/type-transformer';

const name = L.en.commands.build.name();
const buildNameOption = L.en.commands.build.options.buildName.name();

type PostAuthor = {
  user_id: number;
  display_name: string;
};

type Taxonomies = {
  category: string[];
  classes: string[];
  metas: string[];
  post_tag: string[];
  tiers: string[];
};

type Post = {
  id: string;
  post_title: string;
  excerpt: string;
  post_author: PostAuthor;
  post_date_unix: number;
  post_modified_unix: number;
  post_date_formatted: string;
  post_modified_formatted: string;
  metadata: null | any;
  taxonomies: Taxonomies;
  permalink: string;
};

type SearchResponse = {
  hits: Post[];
};

const buildBuilder = new SlashCommandBuilder()
  .setName(name)
  .setNameLocalizations(commandLocaleMapping.build.name)
  .setDescription(L.en.commands.build.description())
  .setDescriptionLocalizations(commandLocaleMapping.build.description)
  .addStringOption(option =>
		option.setName(buildNameOption)
      .setNameLocalizations(commandLocaleMapping.build.options.buildName.name)
			.setDescription(L.en.commands.build.options.buildName.description())
      .setDescriptionLocalizations(commandLocaleMapping.build.options.buildName.description)
			.setAutocomplete(true)
      .setRequired(true));

const build = () => ({
  name,
  execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
    const buildName = interaction.options.getString(buildNameOption) || '';
    await interaction.reply(buildName);
  },
  autocomplete: async (interaction: AutocompleteInteraction<CacheType>) => {
    console.log('yo');

    const focusedValue = interaction.options.getFocused();

    console.log(focusedValue);
    const url = 'https://meilisearch.maxroll.gg/indexes/wp_posts_5/search';
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer 35679298edc476d0b9f9638cdb90d362235a62550bea39d59544f694cc9d90b9'
    };

    const body = JSON.stringify({
      q: focusedValue,
      facets: [],
      attributesToHighlight: ["*"],
      highlightPreTag: "__ais-highlight__",
      highlightPostTag: "__/ais-highlight__",
      limit: 21,
      offset: 0,
      filter: ["taxonomies.category = \"build-guides\""]
    });

    const result = await fetch(url, {
      method: 'POST',
      headers,
      body
    });

    const data = await result.json() as any as SearchResponse;
    console.log(data);

    // const result = buildFuse.search(focusedValue, { limit: 25 });
		await interaction.respond(
			data.hits.map(({ post_title, permalink }) => ({ name: post_title, value: permalink })),
		);
  },
});

export {buildBuilder};
export default build;
