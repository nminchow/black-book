import { APIEmbed } from "discord.js"
import { AffixEntry } from "../data/affixDatabase"


const malignantHeart = async (heart: AffixEntry) => {
  const description = heart.desc.replaceAll('*', '\\*');
  const embed: APIEmbed = {
    author: {
      name: heart.name,
    },
    fields: [
      {
        name: 'Class',
        value: heart.affixClass
      }
    ],
    description,
  };

  return embed;
}

export default malignantHeart;
