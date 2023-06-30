# Localization

If you are looking at this document, it (hopefully), means you are interested in bringing *Black Book* to a new language, or you've noticed something that isn't localized that should be. Your interest is appreciated!

## For Translators

If you aren't familiar with git, that's ok! It can be a bit intimidating, but there are just a couple of steps. Create a GitHub account, and then [fork this repository](https://github.com/nminchow/black-book/fork). From there, you can edit the language files right within the Github UI, or pull them down and edit them locally. Once finished, [create a pull request from your fork](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request-from-a-fork). After a review, changes will be merged!

If you are just making tweaks to a language, look for the folder which corresonds with the language in question in [the localization folder](./) and make your edits on the files within it.

If you are adding a new language, you'll need to copy one of the existing language directories in [the localization folder](./) (for example, [this is the en-US folder](./en)). Then, update the values accordingly. When ready, the language will need to be added to the `SupportedLocale` type [here](/src/i18n/type-transformer.ts) (if you are uncomfortable with this last piece, feel free to create a PR without it and one of the devs familiar with the code can add the new langauge to the list).


## For Missing Localizations

The bot uses a localization library called "[typesafe-i18n](https://github.com/ivanhofer/typesafe-i18n)." There are several examples throughout the code, but essentially, every command has a "Locale" injected into it's context. That locale can then be used to reference the localization object, `L` to find localizations for a given string. For example: `L[locale].commands.skill.errors.notFound()` will render the "not found" error message for the command skill in the supplied `locale`.
