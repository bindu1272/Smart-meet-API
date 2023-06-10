var Validator = require('./Validator');

class MemberValidator extends Validator {
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
      case 'update-member':
        rules = {
          uuid: 'required|exist:Member,Uuid',
        };
        break;

      case 'mark-hospital-favourite':
        rules = {
          uuid: 'required|exist:Hospital,uuid',
          action: 'required|boolean',
        };
        break;

      case 'mark-doctor-favourite':
        rules = {
          uuid: 'required|exist:User,uuid',
          action: 'required|boolean',
        };
        break;
    }
  }
  getMessages(type) {
    let messages = {};
    switch (type) {
    }

    return messages;
  }
}

module.exports = MemberValidator;
