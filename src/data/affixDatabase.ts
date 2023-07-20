// currently just uses data in raw folder
import Fuse from 'fuse.js';

import * as fs from 'fs';

const jsonString = fs.readFileSync('src/data/raw/database.json', 'utf-8');
const jsonData = JSON.parse(jsonString) as Database;

type Database = {
  Sorcerer: ClassEntry,
  Barbarian: ClassEntry,
  Druid: ClassEntry,
  Rogue: ClassEntry,
  Necromancer: ClassEntry,
  Generic: ClassEntry,
}

type ClassEntry = {
  'Item Affix': {
    [key: string]: {
      desc: 'string',
      name: 'string'
    }
  }
}

export type AffixEntry = {
  desc: string,
  name: string,
  affixClass: string,
}

type AffixMapping ={
  [key: string]: AffixEntry
}

const seasonalAffixes = Object.entries(jsonData).reduce((acc, [affixClass, v]) => {
  const result = Object.entries(v['Item Affix']).reduce((innerAcc, [k, affixData]) => {
    if(k.startsWith('s01_orb')) {
      const name = affixData.name.substring(3);
      return { [name]: { affixClass, ...affixData, name } ,...innerAcc }
    }
    return innerAcc;
  }, {} as AffixMapping);
  return { ...acc, ...result };
}, {} as AffixMapping);

const seasonalAffixesFuse = new Fuse(Object.values(seasonalAffixes), {
  keys: ['name'],
  isCaseSensitive: false
});

export { seasonalAffixesFuse };
export default seasonalAffixes;
