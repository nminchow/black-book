# Diablo Black Book

Black Book is a utility bot for Blizzard's _Diablo IV_. 

With the bot, you can get notified of upcoming helltide and world boss events, get data on skills and affixes,  and look up data on paragon nodes. After adding the bot, use the `/help` command for a list of functions!

### [Add Black Book To Your Server](https://discord.com/oauth2/authorize?client_id=1091483908983492639&permissions=377960581696&scope=bot%20applications.commands)

##### From the work of [Lam Essen](https://diablo.fandom.com/wiki/Lam_Esen%27s_Tome_(Quest)).

## Support

I monitor issues and PRs, so feel free to ask questions and communicate through gitub. If you aren't a gihub user, my discord username is `@LeonRdo#4563`. You can find me in [the bot's official support server](http://discord.gg/2nkfTRyvJh).

## Built With

* The data from Lothrik's awesome [build calculator](https://github.com/Lothrik/diablo4-build-calc)
* Event data from [diablo4.life](https://diablo4.life/trackers/world-bosses)
* [discord.js](https://discord.js.org/)

## Local Development/Deployment

If you'd like to deploy the bot yourself:

You'll need a discord application to develop with. You can create one [here](https://discord.com/developers/applications).

Create a `.env` file in the root of this directory with the following:

```
DISCORD_CLIENT_ID=1088608613641232414 # your discord application's client ID
DISCORD_TOKEN="XXX" # your discord application's token
DISCORD_GUILD_ID=989899054815281243 # the guild ID you'd like commands deployed to
GITHUB_TOKEN="XXX" # used to pull data from the gihub api
```

(optional) If you would like to use the bot's event tracker functionality, you will also need a running supabase project either locally or in the cloud:
```
SUPABASE_URL="http://127.0.0.1:54321"
SUPABASE_SERVICE_ROLE_KEY="XXX"
```

Then, install node 16.15 and a version of yarn compatible with the project.

```bash
nvm use # if you are an nvm user
npm install --global yarn # if you don't have yarn installed
```

Then, you should be all set. 

To deploy commands:
```
yarn deploy-commands
```

To pull an updated version of the skills database:
```
yarn pull-data
```

For development of the bot itself using ts directly:
```
yarn dev
```

To build and run the compiled version:
```
yarn build
yarn start
```

## 
