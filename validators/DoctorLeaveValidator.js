var Validator = require('./Validator');

class DoctorLeaveValidator extends Validator {
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
      case 'create-leave':
        rules = {
          date: 'required',
          whole_day: 'required|boolean',
        };
        break;

      case 'leave-timing':
        rules = {
          from_time: 'required',
          to_time: 'required',
        };
        break;

      case 'update-leave':
        rules = {
          uuid: `required|exist_in:DoctorLeave,uuid,hospital_user_id@${App.lodash.get(
            data,
            'hospital_user_id'
          )}`,
          date: 'required',
          whole_day: 'required|boolean',
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

module.exports = DoctorLeaveValidator;
