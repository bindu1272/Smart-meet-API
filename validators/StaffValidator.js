var Validator = require('./Validator');

class StaffValidator extends Validator {
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
      case 'invite-staff':
        rules = {
          email: 'required|email',
          role: `required|in:${App.lodash
            .map(App.helpers.config('settings.roles'), 'value')
            .join(',')}`,
        };
        break;

      case 'validate-department':
        rules = {
          departments: `required|exist_in:Department,uuid,hospital_id@${App.lodash.get(
            data,
            'hospital_id'
          )}`,
        };
        break;

      case 'register-staff-user':
        rules = {
          invite_link_uuid: 'required|exist:InvitationLink,uuid',
          title: 'required',
          name: 'required',
          contact_number: 'required|min:8|max:11',
          contact_code: 'required',
          password: 'required|min:6',
          confirm_password: 'required|min:6',
        };
        break;

      case 'validate-link':
        rules = {
          uuid: 'required|exist:InvitationLink,uuid',
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

module.exports = StaffValidator;
