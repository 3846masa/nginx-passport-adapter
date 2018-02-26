import config from 'config';
import { Strategy as DiscordStrategy } from 'passport-discord';

import urlResolve from '../lib/url-resolve';

const generateDiscordStrategy = () => {
  return new DiscordStrategy(
    {
      clientID: config.get('providers.discord.clientId'),
      clientSecret: config.get('providers.discord.clientSecret'),
      callbackURL: urlResolve({ pathname: '/auth/discord/callback' }),
      scope: ['identify', 'guilds'],
    },
    /** @param {*} profile */
    (accessToken, refreshToken, profile, cb) => {
      profile.refreshToken = refreshToken;
      if (!config.has('providers.discord.guildId')) {
        return cb(null, profile);
      }
      const GUILD_ID = config.get('providers.discord.guildId');
      if (profile.guilds.some(guild => guild.id === GUILD_ID)) {
        return cb(null, profile);
      }
      return cb(new Error('Invalid guilds.'));
    }
  );
};

export default generateDiscordStrategy;
