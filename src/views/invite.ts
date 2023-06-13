import {APIEmbed} from 'discord.js';
import { author } from './shared';

const invite = () => {
  const description =
    `[Invite Link](https://discord.com/oauth2/authorize?client_id=1091483908983492639&permissions=377960581696&scope=bot%20applications.commands)`
  const embed: APIEmbed = {
    author,
    description,
  };

  return embed;
};

export default invite;
