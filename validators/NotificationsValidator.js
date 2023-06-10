var Validator = require('./Validator');

class NotificationsValidator extends Validator {
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
          uuid: 'required|exist:Notifications,uuid',
        };
      case 'delete':
        rules = {
          uuid: 'required|exist:Notifications,uuid'
        }
        break;
      case 'update-notification':
        rules = {
          uuid: 'required|exist:Notifications,uuid'
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

module.exports = NotificationsValidator;
