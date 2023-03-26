// currently just uses data in raw folder


import { barbarianData } from './raw/barbarian';
import { druidData } from './raw/druid';
import { necromancerData } from './raw/necromancer';
import { rogueData } from './raw/rogue';
import { sorcererData } from './raw/sorcerer';

export interface SkillData {
  connections: string[];
  description: string;
  id: number;
  maxPoints: number;
  values: (string | number)[];
  x: number;
  y: number;
  baseSkill?: string;
}

interface ClassData {
  [key: string]: {
    [key: string]: SkillData;
  };
}

interface SkillMapping {
  [key: string]: SkillData;
}

const classData = [ barbarianData, druidData, necromancerData, rogueData, sorcererData ].map(x => x as unknown as ClassData);

const createSkillMapping = (givenClass:ClassData) => {
  return Object.entries(givenClass).reduce((acc, [key, value]) => {
    if (key === 'Trunk Data') {
      return {};
    }
    return { ...acc, ...value };
  }, {} as SkillMapping);
};

const combinedSkills = classData.reduce((acc, givenClass) => {
  return ({ ...acc, ...createSkillMapping(givenClass) })
}, {} as SkillMapping);

export default combinedSkills;
