// currently just uses data in raw folder
import Fuse from 'fuse.js';

import { codexData } from './raw/codex-of-power';
import { codexValues } from './raw/codex-values';

export interface CodexEntry extends RawCodexEntry {
  name: string;
}

interface RawCodexEntry {
  id: number;
  type: string;
  description: string;
  region: string;
  dungeon: string;
  values: (string | number)[];
}

interface Category {
  [key: string]: RawCodexEntry
}

interface ClassEntry {
  [key: string]: Category
}

interface CodexDataFormat {
  [key: string]: ClassEntry;
}

interface CodexMapping {
  [key: string]: CodexEntry
}

const injectEntryName = (category: Category) => {
  return Object.entries(category).reduce((acc, [name, attributes]) => {
    return { ...acc, [name]: { name, ...attributes } }
  }, {} as CodexMapping);
}

const reKeyByName = (entry: ClassEntry) => {
  return Object.values(entry).reduce((acc: CodexMapping, value) => {
    return { ...acc, ...injectEntryName(value) }
  }, {} as CodexMapping)
}

const generateListOfCodexPowers = (codex: CodexDataFormat) => {
  return Object.entries(codex).reduce((acc, [key, value]) => {
    if (key === 'Categories') {
      return acc
    }
    const result = { ...acc, ...reKeyByName(value) }
    return result;
  }, {} as CodexMapping)
};


const codex = generateListOfCodexPowers(codexData as unknown as CodexDataFormat);

const codexFuse = new Fuse(Object.values(codex), {
  keys: ['name'],
  isCaseSensitive: false
});

// console.log(Object.keys(codex).length);
// console.log(codex['Blood-soaked Aspect']);
// console.log(codex[`Earthstriker's Aspect`]);

export { codexFuse };
export default codex;
