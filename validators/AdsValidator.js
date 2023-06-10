var Validator = require('./Validator');

class AdsValidator extends Validator {
  /**
   * Validation rules.
   *
   * @param  string type
   * @param  array data
   * @return Object
   */
  getRules(type, data = {}) {
    let rules = {};

    switch (type) {
      case 'create':
        rules = {
          text: 'required',
        };
        break;
      case 'get' :
        rules = {
          uuid: 'required|exist:Ads,uuid',
        };
      case 'delete':
        rules = {
          uuid: 'required|exist:Ads,uuid'
        }
        break;
      case 'update-ad':
          rules = {
            uuid: 'required|exist:Ads,uuid'
          }
          break;
    }

    return rules;
  }

  getMessages(type) {
    let messages = {};
    switch (type) {
    }

    return messages;
  }
}

module.exports = AdsValidator;
