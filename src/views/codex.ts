import { APIEmbed } from "discord.js"
import fetch from "node-fetch"
import coalesceSkillDescription from "../utility/coalesceSkillDescription"
import { CodexEntry } from "../data/codexDatabase";

const findValidIcon = async (category:string) => {

  const url = `https://rerollcdn.com/DIABLO4/Codex/${category.toLowerCase()}.png`;


  const response = await fetch(url);

  if (response.status === 200) {
    return url;
  };

  return 'https://static.wikia.nocookie.net/diablo/images/b/b3/Fate.png';
};

const codex = async (codex: CodexEntry) => {
  const description = coalesceSkillDescription(codex)

  const icon_url = await findValidIcon(codex.category);

  const embed: APIEmbed = {
    author: {
      name: codex.name,
      icon_url,
    },
    description
  };

  return embed;
}

export default codex;
