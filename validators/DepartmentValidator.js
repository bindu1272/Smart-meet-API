var Validator = require('./Validator');

class DepartmentValidator extends Validator {
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
      case 'create-department':
        rules = {
          name: 'required',
          email: 'required|email',
          contact_code: 'required',
          contact_number: 'required',
        };
        break;

      case 'update-department':
        rules = {
          uuid: 'required|exist:Department,uuid',
          name: 'required',
          email: 'required|email',
          contact_code: 'required',
          contact_number: 'required',
        };
        break;

      case 'assign-department':
        rules = {
          uuid: 'required|exist:Department,uuid',
          doctor_uuid: 'required|exist_in:User,uuid',
        };
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

module.exports = DepartmentValidator;
