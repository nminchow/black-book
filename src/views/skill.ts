import { APIEmbed } from "discord.js"
import { SkillData } from "../data/database"
import fetch from "node-fetch"
import coalesceSkillDescription from "../utility/coalesceSkillDescription"

const findValidIcon = async (skillName:string) => {
  const normalized = skillName.toLowerCase().replaceAll(' ', '_')
  const [_, ...withoutFirstWord] = normalized.split('_');

  const normalUrl = `https://rerollcdn.com/DIABLO4/Skills/${normalized}.png`;
  const withoutFirstUrl = `https://rerollcdn.com/DIABLO4/Skills/${withoutFirstWord.join('_')}.png`;

  const [normalResponse, withoutFirstResponse] = await Promise.all(
    [fetch(normalUrl), fetch(withoutFirstUrl)]
  );

  if (normalResponse.status === 200) {
    return normalUrl;
  };

  if (withoutFirstResponse.status === 200) {
    return withoutFirstUrl;
  }

  return 'https://static.wikia.nocookie.net/diablo/images/b/b3/Fate.png';
};

const skill = async (skill: SkillData) => {
  const description = coalesceSkillDescription(skill)

  const icon_url = await findValidIcon(skill.skill);


  const embed: APIEmbed = {
    author: {
      name: skill.skill,
      icon_url,
    },
    description
  };

  return embed;;
}

export default skill;
