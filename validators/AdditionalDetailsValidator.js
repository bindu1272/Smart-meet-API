var Validator = require('./Validator');

class AdditionalDetailsValidator extends Validator {
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
      case 'update-details':
        rules = {
          uuid: 'required|exist:AdditionalDetails,uuid'
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

module.exports = AdditionalDetailsValidator;
