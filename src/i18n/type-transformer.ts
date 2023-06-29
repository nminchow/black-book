// Note: It would be cool if we could make these types self-generate, but I
// wasn't having much luck. This is the limit of my TS knowledge, and it works
// pretty well, but when new languages are added, they do need added here.

import { Locale } from 'discord.js';
import { Locales } from './i18n-types.js';
import en from './en';
import en_GB from './gb/index.js';


export type LocaleMappingEntry = {
  staticMapping: typeof en,
  locale: Locales,
}

export type SupportedLocale = Extract<Locale, Locale.EnglishUS | Locale.EnglishGB>;

type LocaleMapping = Record<SupportedLocale, LocaleMappingEntry>;

// https://discord.com/developers/docs/reference#locales
export const localeMapping: LocaleMapping = {
  [Locale.EnglishUS]: {
    staticMapping: en,
    locale: 'en',
  },
  [Locale.EnglishGB]: {
    staticMapping: en_GB,
    locale: 'gb',
  },
};

type CommandType = typeof en.commands;
type Languages = keyof typeof localeMapping;

interface Command {
  name: string,
  description: string,
  options?: {
    [key: string]: {
      name: string,
      description: string
    }
  }
}

type LibraryStructure = {
  [key in Languages]: {
    staticMapping: {
      commands: {
        [key: string]: Command
      }
    }
  }
}

type KeyedByPath = {
  commands: {
    [k in keyof CommandType]: {
      name: {
        [key in Languages]: string
      },
      description: {
        [key in Languages]: string
      },
      options: {
        [key in keyof CommandType[k]['options']]: {
          name: {
            [key in Languages]: string
          },
          description: {
            [key in Languages]: string
          },
        }
      }
    }
  }
}

const keyByPath = (languageMapping: LibraryStructure): KeyedByPath => {
  const commands: any = { commands: {} };

  for (const language in languageMapping) {
    const asKey = language as keyof LibraryStructure;
    const entry = languageMapping[asKey];
    // if (entry === undefined) break;
    for (const command in entry.staticMapping.commands) {
      if (!commands.commands[command]) {
        commands.commands[command] = {
          name: {},
          description: {},
          options: {}
        };
      }
      commands.commands[command].name[language] = entry.staticMapping.commands[command].name;
      commands.commands[command].description[language] = entry.staticMapping.commands[command].description;

      const options = entry.staticMapping.commands[command].options;
      if (!options) continue;
      if (options) {
        for (const option in entry.staticMapping.commands[command].options) {
          if (!commands.commands[command].options[option]) {
            commands.commands[command].options[option] = {
              name: {},
              description: {}
            };
          }
          commands.commands[command].options[option].name[language] = options[option].name;
          commands.commands[command].options[option].description[language] = options[option].description;
        }
      }
    }
  }

  return commands;
};

export const commandLocaleMapping = keyByPath(localeMapping).commands;

const isKeyOfObject = <T extends Object>(
  key: string | number | symbol,
  obj: T,
): key is keyof T => {
  return key in obj;
};

export const parseLocale = (input: string) => {
  return isKeyOfObject(input, localeMapping) ? localeMapping[input] : localeMapping[Locale.EnglishUS];
}

export const parseLocaleString = (input: string) => {
  return isKeyOfObject(input, localeMapping) ? localeMapping[input].locale : localeMapping[Locale.EnglishUS].locale;
}
