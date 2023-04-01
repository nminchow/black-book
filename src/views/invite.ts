import {APIEmbed} from 'discord.js';

const invite = () => {
  const description =
    `[Invite Link](https://discord.com/oauth2/authorize?client_id=1091483908983492639&permissions=377960581696&scope=bot%20applications.commands)`
  const embed: APIEmbed = {
    author: {
      name: 'Diablo Black Book',
      icon_url: 'https://static.wikia.nocookie.net/diablo/images/0/09/Act3Q4.gif',
    },
    description,
  };

  return embed;
};

export default invite;
