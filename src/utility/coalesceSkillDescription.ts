import { CodexEntry } from "../data/codexDatabase";
import { SkillData } from "../data/skillDatabase";

const coalesceSkillDescription = (skill:SkillData | CodexEntry) => {
  return skill.values.reduce((description, x) => {
    if (!x) {
      return description.toString().replace('{#}', '#');
    }
    return description.toString().replace('{#}', x.toString());
  }, skill.description).toString();
}

export default coalesceSkillDescription;
