import { APIEmbed } from "discord.js"
import { VampiricPower } from "../data/vampiricPowerDatabase";

const vampiricPower = async (power: VampiricPower) => {
  const description = power.description.replaceAll('*', '\\*');
  const embed: APIEmbed = {
    author: {
      name: power.name,
    },
    fields: [
      {
        name: 'Type',
        value: power.type
      }
    ],
    description,
  };

  return embed;
}

export default vampiricPower;
