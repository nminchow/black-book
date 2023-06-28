// Note: It would be cool if we could make these types self-generate, but I
// wasn't having much luck. This is the limit of my TS knowledge, and it works
// pretty well, but when new languages are added, they do need added here.

import en from './en';
import enGB from './enGB';

const locales = {
  'en-GB': enGB,
  'en-US': en,
};

type CommandType = typeof en.commands;
type Languages = keyof typeof locales;

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
    commands: {
      [key: string]: Command
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
    for (const command in languageMapping[asKey].commands) {
      if (!commands.commands[command]) {
        commands.commands[command] = {
          name: {},
          description: {},
          options: {}
        };
      }
      commands.commands[command].name[language] = languageMapping[asKey].commands[command].name;
      commands.commands[command].description[language] = languageMapping[asKey].commands[command].description;

      const options = languageMapping[asKey].commands[command].options;
      if (!options) continue;
      if (options) {
        for (const option in languageMapping[asKey].commands[command].options) {
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

const commandLocaleMapping = keyByPath(locales).commands;

export { commandLocaleMapping };

