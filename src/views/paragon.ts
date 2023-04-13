import { APIEmbed } from "discord.js"
import { NodeEntry } from "../data/paragonDatabase"

const paragon = async (paragon: NodeEntry) => {

  const { name, description, class: className } = paragon;

  const embed: APIEmbed = {
    author: {
      name: `${name} - (${className})`,
    },
    description
  };

  return embed;
}

export default paragon;
