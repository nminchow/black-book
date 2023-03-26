// currently just uses data in raw folder


import { barbarianData } from './raw/barbarian';

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

const barbarian = barbarianData as unknown as ClassData;

Object.entries(barbarian).map(([ key, value ]) => {
  if (key === 'Trunk Data') {
    return {};
  }
  return value
});

const combinedSkills = Object.entries(barbarian).reduce((acc, [key, value]) => {
  if (key === 'Trunk Data') {
    return {};
  }
  return { ...acc, ...value };
}, {} as SkillMapping);

// console.log(combinedSkills);

export default combinedSkills;
