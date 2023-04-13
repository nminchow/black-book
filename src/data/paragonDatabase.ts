// currently just uses data in raw folder
import Fuse from 'fuse.js';

import { paragonData } from './raw/paragon';

export interface NodeEntry extends RawNodeEntry {
  class: string;
  name: string;
}

interface RawNodeEntry {
  name?: string;
  description: string;
}

interface Node {
  [key: string]: RawNodeEntry
}

interface ClassEntry {
  Node: Node
}

interface ParagonDataFormat {
  [key: string]: ClassEntry;
}

interface ParagonMapping {
  [key: string]: NodeEntry
}

// const injectEntryName = (entries: Category, category: string) => {
//   return Object.entries(entries).reduce((acc, [name, attributes]) => {
//     return { ...acc, [name]: { name, ...attributes, category } }
//   }, {} as CodexMapping);
// }

// const reKeyByName = (entry: ClassEntry) => {
//   return Object.entries(entry).reduce((acc: CodexMapping, [categoryName, entries]) => {
//     return { ...acc, ...injectEntryName(entries, categoryName) }
//   }, {} as CodexMapping)
// }

const createEntriesForClass = (className: string, node: Node) => {
  return Object.entries(node).reduce((acc, [key, entry]) => {
    const name = entry.name || key.replaceAll('_', ' ');
    return { ...acc, [name]: { class: className, name, ...entry } };
  }, {} as ParagonMapping)
}

const generateListOfParagonNodes = (paragon: ParagonDataFormat) => {
  return Object.entries(paragon).reduce((acc, [className, values]) => {
    return { ...acc, ...createEntriesForClass(className, values.Node)};
  }, {} as ParagonMapping);
};


const paragon = generateListOfParagonNodes(paragonData as unknown as ParagonDataFormat);

const paragonFuse = new Fuse(Object.values(paragon), {
  keys: ['name'],
  isCaseSensitive: false
});

// console.log(Object.keys(codex).length);
// console.log(codex['Blood-soaked Aspect']);

export { paragonFuse };
export default paragon;
