// currently just uses data in raw folder
import Fuse from 'fuse.js';

import { barbarianData } from './raw/barbarian';
import { druidData } from './raw/druid';
import { necromancerData } from './raw/necromancer';
import { rogueData } from './raw/rogue';
import { sorcererData } from './raw/sorcerer';


export interface SkillData extends RawSkillData {
  skill: string;
}

interface RawSkillData {
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
    [key: string]: RawSkillData;
  };
}

interface RawSkillMapping {
  [key: string]: RawSkillData;
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
  }, {} as RawSkillMapping);
};

const combinedSkills = classData.reduce((acc, givenClass) => {
  return ({ ...acc, ...createSkillMapping(givenClass) })
}, {} as RawSkillMapping);

const withSkillName = Object.entries(combinedSkills).reduce((acc, [skill, attributes]) => {
return { ...acc, [skill]: { skill, ...attributes } }
}, {} as SkillMapping)

console.log(Object.values(withSkillName).slice(0,3));

const skillFuse = new Fuse(Object.values(withSkillName), {
  keys: ['skill'],
  isCaseSensitive: false
});

export { skillFuse };
export default withSkillName;
