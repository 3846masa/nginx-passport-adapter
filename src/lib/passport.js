import config from 'config';
import passport from 'passport';
import generateDiscordStrategy from '../strategies/discord';
import generateSlackStrategy from '../strategies/slack';

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

if (config.has('providers.discord.clientId') && config.has('providers.discord.clientSecret')) {
  passport.use(generateDiscordStrategy());
}
if (config.has('providers.slack.clientId') && config.has('providers.slack.clientSecret')) {
  // @ts-ignore
  passport.use(generateSlackStrategy());
}

export default passport;
