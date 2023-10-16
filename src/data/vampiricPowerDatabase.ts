// currently just uses data in raw folder
import Fuse from 'fuse.js';

import * as fs from 'fs';

const jsonString = fs.readFileSync('src/data/manual/vampiricPower.json', 'utf-8');
const vampiricPowers = JSON.parse(jsonString) as [VampiricPower];

export interface VampiricPower {
  name: string;
  type: "Major" | "Minor";
  requirements: {
    divinity: number;
    eternity: number;
    ferocity: number;
  }
  description: string;
}

const vampiricPowerFuse = new Fuse(Object.values(vampiricPowers), {
  keys: ['name'],
  isCaseSensitive: false
});

const keyedByName = vampiricPowers.reduce((acc, { name, ...rest }) => {
  acc[name] = { name, ...rest };
  return acc;
}, {} as { [key: string]: VampiricPower })

export { vampiricPowerFuse };
export default keyedByName;
