const url = require('url');
const os = require('os');
const crypto = require('crypto');
const defer = require('config/defer').deferConfig;

module.exports = {
  core: {
    secretKey: crypto.randomBytes(32).toString('base64'),
    hostUrl: defer(function() {
      return url.format({
        protocol: 'http:',
        hostname: os.hostname(),
        port: this.core.port,
      });
    }),
    appRefreshInterval: '86400',
    adapterRefreshInterval: '604800',
    port: '3000',
  },
};
