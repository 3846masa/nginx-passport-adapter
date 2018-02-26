import crypto from 'crypto';

const ALGOLITHM = 'aes-256-gcm';

class AES265GCM {
  /**
   * @param {string} key
   */
  constructor(key) {
    const hash = crypto.createHash('sha256');
    hash.update(key);
    this.key = Buffer.from(hash.digest('base64'), 'base64');
  }

  /**
   * @param {*} obj
   */
  encrypt(obj) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGOLITHM, this.key, iv);
    const data = {
      encoded: `${cipher.update(JSON.stringify(obj), 'utf8', 'base64')}${cipher.final('base64')}`,
      ivBase64: iv.toString('base64'),
      authTagBase64: cipher.getAuthTag().toString('base64'),
    };
    return Buffer.from(JSON.stringify(data), 'utf8').toString('base64');
  }

  /**
   * @param {string} base64
   */
  decrypt(base64) {
    const { encoded, ivBase64, authTagBase64 } = JSON.parse(Buffer.from(base64, 'base64').toString('utf8'));
    const decipher = crypto.createDecipheriv(ALGOLITHM, this.key, Buffer.from(ivBase64, 'base64'));
    decipher.setAuthTag(Buffer.from(authTagBase64, 'base64'));
    return JSON.parse(`${decipher.update(encoded, 'base64', 'utf8')}${decipher.final('utf8')}`);
  }
}

export { AES265GCM };
