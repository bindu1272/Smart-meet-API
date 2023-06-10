const sizeOf = require('image-size');
const strtr = require('locutus/php/strings/strtr');
const intval = require('locutus/php/var/intval');
const trim = require('locutus/php/strings/trim');
const GenericError = require('../errors/GenericError');
const readChunk = require('read-chunk');
const fileType = require('file-type');
const fs = require('fs');
const path = require('path');
const { getDistance } = require('geolib');

class Helper {
  static getRadius(x1, y1, x2, y2) {
    const distance = getDistance(
      { latitude: x1, longitude: y1 },
      { latitude: x2, longitude: y2 }
    );
    return distance / 2;
  }

  static isEmpty(value) {
    let bool =
      value == null ||
      (typeof value === 'string' && value.length === 0) ||
      (App.lodash.isArray(value) && value.length === 0);

    if (typeof value === 'object') {
      for (let key in value) {
        if (value.hasOwnProperty(key)) return false;
      }
      return true;
    }

    return bool;
  }

  static replaceMultiple(string, mapObj) {
    const re = new RegExp(Object.keys(mapObj).join('|'), 'gi');
    string = string.replace(re, (matched) => mapObj[matched]);
    return string;
  }

  static getQueryParamsString(paramsObj = {}) {
    let parts = [];
    for (var i in paramsObj) {
      if (paramsObj.hasOwnProperty(i)) {
        parts.push(
          encodeURIComponent(i) + '=' + encodeURIComponent(paramsObj[i])
        );
      }
    }
    return '?' + parts.join('&');
  }

  static getRoute(baseRouteKey, key = '', returnObj = false) {
    let routes = require('../../routes');
    let baseRoutePrefix = App.helpers.getObjProp(
      routes,
      `${baseRouteKey}.prefix`
    );

    let listedRoutesObj = App.helpers.getObjProp(
      routes,
      `${baseRouteKey}.list`
    );
    let foundKey = App.lodash.findKey(listedRoutesObj, { name: key });

    if (!foundKey) {
      return null;
    }

    if (returnObj) {
      return App.helpers.getObjProp(listedRoutesObj, foundKey);
    }

    let foundKeyArr = foundKey.split(' ');
    let routeStr = App.lodash.last(foundKeyArr);

    return App.env.BASE_URL + path.resolve(baseRoutePrefix, routeStr);
  }

  static getTokenExpiryTime() {
    const now = App.moment();
    const endDay = App.moment().endOf('day');
    return endDay.diff(now, 'seconds');
  }

  static getBookingId() {
    let time = App.moment().format('x');
    let date = App.moment().format('MM-YYYY');
    let random = parseInt(this.getRandomInt(1000, 9999));

    return `${time}/${date}/${random}`;
  }

  static getWorkingHours(start, end) {
    return App.lodash.round(
      App.moment(end, 'HH:mm:ss').diff(
        App.moment(start, 'HH:mm:ss'),
        'seconds'
      ) / 3600,
      2
    );
  }

  static isObject(value) {
    return Object.prototype.toString.call(value) === '[object Object]';
  }

  static cloneObj(obj, ...sources) {
    return App.lodash.assign({}, obj, ...sources);
  }

  static getObjProp(obj, dotNotationStr, defaultVal = null) {
    return App.lodash.get(obj, dotNotationStr, defaultVal);
  }

  static config(dotNotationStr = '', defaultVal = null) {
    const config = require('../../config');
    return this.getObjProp(config, dotNotationStr, defaultVal);
  }

  static formatDate(date, format = 'Do MMM, YYYY (hh:mm A)') {
    return App.moment(date).format(format);
  }

  /**
   * Get default pagination limit
   *
   * {number} key [key to pick]
   */
  static getDefaultPaginationLimit(key = 'default') {
    return this.config('settings.pagination.limit')[key];
  }

  /**
   * Get computed pagination limit on the basis of passed limit
   *
   * @return {number} limit for pagination
   */
  static getComputedPaginationLimit(limit = null) {
    limit = limit || this.getDefaultPaginationLimit();

    if (limit > this.config('settings.pagination.limit.max')) {
      limit = this.config('settings.pagination.limit.max');
    }
    return parseInt(limit);
  }

  /**
   * [getMimeType description]
   * @param  {[type]} path [description]
   * @return {[type]}      [description]
   */
  static getMimeType(path) {
    if (!Buffer.isBuffer(path)) {
      const buffer = readChunk.sync(path, 0, 4100);
      return fileType(buffer);
    }
    return fileType(path);
  }

  /**
   * [getDimension description]
   * @param  {[type]} path [description]
   * @return {[type]}      [description]
   */
  static getDimension(path) {
    return new Promise((resolve, reject) => {
      return sizeOf(path, (err, dimensions) => {
        if (err) return reject(err);
        return resolve(dimensions);
      });
    });
  }

  /**
   * Get Translated String for the provided one
   * @param {string}  string
   * @param {array}   attributes
   */
  static getTranslatedStr(string, attributes = {}) {
    if (App.lodash.isString(string)) {
      return strtr(string, attributes);
    }
    return string;
  }

  static intVal(mixedVar, base) {
    return base ? intval(mixedVar, base) : intval(mixedVar);
  }

  static strSlug(str) {
    let slug = str
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');

    return this.trimStr(slug);
  }

  static trimStr(str, char = null) {
    return char ? trim(str, char) : trim(str);
  }

  static getDataValues(data) {
    return this.getObjProp(data, 'dataValues');
  }

  /**
   * Return the string with ['_', ' '] converted to camel case
   * @param  {[String]} string
   * @return {[String]}
   */
  static toCamelCase(string) {
    const [first, ...rest] = string
      .replace(/[^\w]/g, ' ')
      .split(/[-_\s+]/)
      .filter(Boolean);
    return (
      first.toLowerCase() +
      rest
        .map(
          (char) => char.charAt(0).toUpperCase() + char.slice(1).toLowerCase()
        )
        .join('')
    );
  }

  /**
   * Return an object with the keys specified
   *
   * @param  Object         obj
   * @param  array | string keys
   * @return Object
   */

  static objectOnly(obj, keys) {
    let target = {};
    for (var i in obj) {
      if (keys.indexOf(i) < 0) continue;

      if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;

      target[i] = obj[i];
    }

    return target;
  }

  /**
   * Return an object without the keys specified
   *
   * @param  Object         obj
   * @param  array | string keys
   * @return Object
   */
  static objectExcept(obj, keys) {
    let target = {};
    for (var i in obj) {
      if (keys.indexOf(i) >= 0) continue;

      if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;

      target[i] = obj[i];
    }

    return target;
  }

  static getOTP(min = 1001, max = 9999) {
    let otp = parseInt(Math.random() * (max - min) + min);
    return otp;
  }

  static getPathValue(key = '') {
    return this.config(`paths.${key}`);
  }

  static getMessageValue(key = '') {
    return this.config(`messages.${key}`);
  }

  static spaceLog(...args) {
    console.log('\n\n\n');
    args.forEach((element) => console.log(element));
    console.log('\n\n\n');
  }

  static getToken(req, res, key = null) {
    const authHeader = this.getObjProp(req, 'headers.authorization');
    if (!authHeader) {
      return res.error(new GenericError('No Auth Token found'), 400);
    }
    const token = authHeader.split(' ')[1];
    return key ? this.getObjProp(token, key) : token;
  }

  static async bcryptPassword(password) {
    const bcrypt = require('bcrypt');
    return await bcrypt.hash(
      password,
      this.config('settings.bcrypt.saltRounds')
    );
  }

  static getUuid() {
    const { v4: uuidv4 } = require('uuid');
    return uuidv4();
  }

  static getImageUrl(key) {
    if (!key) {
      return App.env.BUCKET_URL.replace('{key}', 'default.png');
    }
    return App.env.BUCKET_URL.replace('{key}', key);
  }
  static getVideoUrl(key) {
    if (!key) {
      return null;
    }
    return App.env.VIDEO_BUCKET_URL.replace('{key}', key);
  }

  static getImageName(fileType = 'image/png') {
    let uuid = this.getUuid();
    let type = 'png';

    switch (fileType) {
      case 'image/png':
        type = 'png';
        break;
      case 'image/jpeg':
        type = 'jpg';
        break;
    }
    return `${uuid}.${type}`;
  }

  static showMessage(message1, message2 = '') {
    console.log(
      App.chalk.green('\n\n####################################\n\n'),
      message1,
      message2,
      App.chalk.green('\n\n####################################\n\n')
    );
  }

  static logMessage(message1, message2 = '') {
    console.log(
      App.chalk.cyan('\n\n####################################\n\n'),
      message1,
      message2,
      App.chalk.cyan('\n\n####################################\n\n')
    );
  }

  static notify(message, data = '') {
    console.log(App.chalk.yellow('\n\n', message), '\n', data, '\n\n');
  }

  static getRandomInt(min = 100000, max = 999999) {
    return Math.random() * (max - min) + min;
    // return Math.floor(Math.random() * Math.floor(max));
  }

  static getRandomStr(length = 6, chars = 'a#', options = {}) {
    var mask = '';
    if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
    if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (chars.indexOf('#') > -1) mask += '0123456789';
    if (chars.indexOf('!') > -1) mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';
    var result = '';
    for (var i = length; i > 0; --i)
      result += mask[Math.round(Math.random() * (mask.length - 1))];

    if ('prefix' in options && !App.helpers.isEmpty(options.prefix)) {
      result = `${options.prefix}${result}`;
    }

    if ('suffix' in options && !App.helpers.isEmpty(options.suffix)) {
      result = `${result}${options.suffix}`;
    }

    return result;
  }

  static getPreparedFilename(type) {
    const timestamp = new Date().getTime();
    const randomNumber = parseInt(this.getRandomInt(1000, 9999));
    return `${timestamp}-${randomNumber}-${type}`;
  }

  static getBucketPath(type) {
    let basePath = `${App.paths.s3.bucket}`;

    switch (type) {
      case 'profile_photo':
        return `${basePath}/${App.helpers.getPathValue(
          'images.profile_pictures.default'
        )}`;

      case 'draft':
        return `${basePath}/${App.helpers.getPathValue(
          'documents.drafts.default'
        )}`;
    }
  }

  static env(dotNotationStr = '', defaultVal = null) {
    let returnVal = this.getObjProp(App.env, dotNotationStr, defaultVal);

    try {
      returnVal = JSON.parse(returnVal);
    } catch (e) {
      return returnVal;
    }

    return returnVal;
  }

  static async saveFile(filename, content) {
    return new Promise((resolve, reject) => {
      fs.appendFile(filename, content, 'utf-8', (err, file) => {
        if (err) reject(err);
        else resolve(file);
      });
    });
  }

  static async moveFile(source, destination) {
    return new Promise((resolve, reject) => {
      fs.rename(source, destination, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  static async removeFile(filePath, sync = true) {
    if (sync) {
      return fs.unlinkSync(path.resolve(filePath));
    }
    return fs.unlink(path.resolve(filePath));
  }

  static getAdminEmails(type = 'all', delimeter = ',') {
    let email = '';

    switch (type) {
      case 'all':
        email = App.env.ADMIN_EMAILS;
        break;
    }

    return email.split(delimeter);
  }

  static log(message = null, level = 'info', options = {}) {
    const Logger = require('../utilities/Logger');
    let loggerObj = new Logger(options);
    switch (level) {
      case 'warn':
        return loggerObj.log().warn(message);

      case 'error':
        return loggerObj.log().error(message);

      default:
        return loggerObj.log().info(message);
    }
  }

  static getAuthUser(req) {
    return this.getObjProp(req, 'auth.user', null);
  }

  static addMetaDataToReq(req, data) {
    if (req.hasOwnProperty('meta')) {
      req['meta'] = this.cloneObj(req.meta, data);
    } else {
      req['meta'] = data;
    }

    return req;
  }

  static getAddress(addressObj) {
    const add1 = App.lodash.get(addressObj, 'address_1')
      ? App.lodash.get(addressObj, 'address_1')
      : '';
    const add2 = App.lodash.get(addressObj, 'address_2')
      ? `, ${App.lodash.get(addressObj, 'address_2')}`
      : '';
    const postalCode = App.lodash.get(addressObj, 'pin_code')
      ? `, ${App.lodash.get(addressObj, 'pin_code')}`
      : '';
    const state = App.lodash.get(addressObj, 'state')
      ? `, ${App.lodash.get(addressObj, 'state')}`
      : '';
    const suburb = App.lodash.get(addressObj, 'suburb')
      ? `, ${App.lodash.get(addressObj, 'suburb')}`
      : '';

    return `${add1}${add2}${suburb}${state}${postalCode}`;
  }
}

module.exports = Helper;
