import config from 'config';
import url from 'url';

/**
 * @param {url.UrlObject} obj
 * @param {string?}       baseUrl
 */
export default function resolve(obj, baseUrl = config.get('core.hostUrl')) {
  return url.format({
    ...url.parse(baseUrl),
    ...obj,
    search: undefined,
  });
}
