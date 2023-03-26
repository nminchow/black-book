import { SkillData } from "./database";

const coalesceSkillDescription = (skill:SkillData) => {
  return skill.values.reduce((description, x) => {
    return description.toString().replace('{#}', x.toString());
  }, skill.description).toString();
}

export default coalesceSkillDescription;
