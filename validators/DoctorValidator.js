var Validator = require('./Validator');

class DoctorValidator extends Validator {
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
      case 'send-invitation':
        rules = {
          email: 'required|email',
        };
        break;
      case 'validate-link':
        rules = {
          uuid: 'required|exist:InvitationLink,uuid',
        };
        break;

      case 'mark-doctor-favourite':
        rules = {
          uuid: 'required|exist:User,uuid',
          action: 'required|boolean',
        };
        break;

      case 'mark-hospital-favourite':
        rules = {
          uuid: 'required|exist:Hospital,uuid',
          action: 'required|boolean',
        };
        break;

      case 'register-doctor-validate-link':
        rules = {
          user_exists: 'required|boolean',
          invite_link_uuid: 'required|exist:InvitationLink,uuid',
        };
        break;
      case 'register-doctor-user':
        rules = {
          title: 'required',
          name: 'required',
          contact_number: 'required|min:8|max:11',
          contact_code: 'required',
          password: 'required|min:6',
          confirm_password: 'required|min:6',
        };
        break;
      case 'register-doctor-details':
        rules = {
          about: 'required',
          experience: 'required|numeric',
          address_1: 'required',
          address_2: 'required',
          state: 'required',
          country: 'required',
          pin_code: 'required',
          qualifications: 'required',
          specialisations: 'required|exist_in:Specialization,uuid',
        };
        break;
      case 'update-doctor':
        rules = {
          title: 'required',
          name: 'required',
          contact_number: 'required|min:8|max:11',
          contact_code: 'required',
        };
        break;
      case 'admin-update-doctor':
        rules = {
          uuid: 'required|exist:User,uuid',
        };
        break;
      case 'doctor-slots':
        rules = {
          uuid: 'required|exist:User,uuid',
          hospital_uuid: 'required|exist:Hospital,uuid',
          date: 'required|date',
        };
        break;
      case 'doctor-exists':
        rules = {
          uuid: 'required|exist:User,uuid',
        };
        break;

      case 'doctor-monthly-slots':
        rules = {
          uuid: 'required|exist:User,uuid',
          hospital_uuid: 'required|exist:Hospital,uuid',
        };
        break;

      case 'update-working-hours':
        rules = {
          uuid: 'required|exist:User,uuid',
          appointment_duration: 'required|numeric',
          availability: 'required',
        };
        break;

      case 'validate-lineup-link':
        rules = {
          uuid: 'required|exist:User,uuid',
          hospital_uuid: 'required|exist:Hospital,uuid',
        };
        break;
        case 'doctor-hospital':
        rules = {
          uuid: 'required|exist:Doctor,uuid',
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

module.exports = DoctorValidator;
