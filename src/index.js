import 'dotenv/config';
import config from 'config';
import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import session from 'express-session';
import url from 'url';
import { addSeconds, isFuture } from 'date-fns';

import { AES265GCM } from './lib/crypto';
import passport from './lib/passport';
import urlResolve from './lib/url-resolve';

// @ts-ignore
const PROVIDER_LIST = Object.freeze(Object.keys(passport._strategies).filter(p => p !== 'session'));

const aesCrypto = new AES265GCM(config.get('core.secretKey'));
const app = express();

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: config.get('core.secretKey'),
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000 /* 1 day */,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => res.status(401).end());

app.get('/test', (req, res) => {
  if (req.session.provider && req.session.userId && isFuture(req.session.expiredAt)) {
    return res.status(200).end();
  }
  req.session.destroy(() => {
    res.status(401).end();
  });
});

app.get('/initiate', (req, res) => {
  const redirectUrl = urlResolve({
    pathname: '/auth',
    query: {
      back: req.header('X-NGX-PASSPORT-BACK-TO'),
      callback: req.header('X-NGX-PASSPORT-CALLBACK'),
      provider: (
        req.header('X-NGX-PASSPORT-PROVIDER') ||
        (config.has('core.defaultProvider') ? config.get('core.defaultProvider') : PROVIDER_LIST[0])
      ).toLowerCase(),
    },
  });
  res.redirect(redirectUrl);
});

app.get('/auth', (req, res, next) => {
  if (!req.query.provider) {
    return res.status(400).end();
  }
  req.session.backUrl = req.query.back;
  req.session.callback = req.query.callback;
  return res.redirect(`/auth/${req.query.provider}`);
});

PROVIDER_LIST.forEach(provider => {
  app.get(`/auth/${provider.toLowerCase()}`, passport.authenticate(provider));

  app.get(
    `/auth/${provider.toLowerCase()}/callback`,
    passport.authenticate(provider, { failureRedirect: '/' }),
    (req, res) => {
      const encrypted = aesCrypto.encrypt({
        provider: req.user.provider,
        userId: req.user.id,
        backUrl: req.session.backUrl,
        expiredAt: addSeconds(Date.now(), parseInt(config.get('core.refreshInterval'), 10)).valueOf(),
      });
      const redirectUrl = urlResolve({ query: { encrypted } }, req.session.callback);
      res.redirect(redirectUrl);
    }
  );
});

app.get('/callback', (req, res) => {
  const data = aesCrypto.decrypt(req.query.encrypted);
  Object.assign(req.session, data);
  res.redirect(data.backUrl);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(400).end();
});

app.listen(config.get('core.port'), err => {
  if (err) {
    return console.log(err);
  }
  console.log('Listening...');
});
