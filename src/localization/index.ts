// import { LocaleString, LocalizationMap } from "discord.js"

// type Localization = {
//   commands: {
//     [key: string]: {
//       name: LocalizationMap,
//       description: LocalizationMap,
//       options: {
//         [key: string]: LocalizationMap
//       }
//     }
//   },
//   views: {
//     [key: string]: {
//       [key: string]: (local: LocaleString, ...args: string[]) => string;
//     }
//   }
// }

// const localized = {
//   views: {
//     hellTide: {
//       title: {
//         'en-US': (name, location) => `${name} in ${location}`
//       }
//     }
//   }

// } //as Localization;

// const wrapper = (local: LocaleString);

// const createHandler = (acc, [key, value]) => {
//   return { ...acc, [key]: (locale) => {

//   }};
// };

// const result = {
//   views: {
//     hellTide: Object.entries(localized.views.hellTide).reduce(createHandler, {})
//   }
// }
