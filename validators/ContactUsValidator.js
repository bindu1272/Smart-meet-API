var Validator = require('./Validator');

class ContactUsValidator extends Validator {
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
          name: 'required',
          comments: 'required',
          email:'required|email',
          phone: 'required|min:8|max:11',
        };
        break;
      case 'search':
        rules = {
          id: 'required|exist:User,uuid',
        };
        break;
      case 'get' :
        rules = {
          uuid: 'required|exist:ContactUs,uuid',
        };
      case 'delete':
        rules = {
          uuid: 'required|exist:ContactUs,uuid'
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

module.exports = ContactUsValidator;
