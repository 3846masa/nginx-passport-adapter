import config from 'config';
import { Strategy as SlackStrategy } from 'passport-slack-oauth2';

import urlResolve from '../lib/url-resolve';

const generateSlackStrategy = () => {
  return new SlackStrategy(
    {
      clientID: config.get('providers.slack.clientId'),
      clientSecret: config.get('providers.slack.clientSecret'),
      callbackURL: urlResolve({ pathname: '/auth/slack/callback' }),
      scope: ['identity.basic', 'identity.team'],
    },
    (accessToken, refreshToken, profile, cb) => {
      profile.refreshToken = refreshToken;
      if (!config.has('providers.slack.teamId')) {
        return cb(null, profile);
      }
      const TEAM_ID = config.get('providers.slack.teamId');
      if (profile.team.id === TEAM_ID) {
        return cb(null, profile);
      }
      return cb(Error('Invalid team.'));
    }
  );
};

export default generateSlackStrategy;
