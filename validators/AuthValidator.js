var Validator = require('./Validator');

class AuthValidator extends Validator {
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
      case 'login':
        rules = {
          email: 'required|validate_login_staff',
          password: 'required|min:6',
        };
        break;

      case 'gmail-login':
        rules = {
          token_id: 'required',
        };
        break;

      case 'resend-otp':
        rules = {
          uuid: 'required|exist:Otp,uuid',
        };
        break;

      case 'update-user':
        rules = {
          email: 'required|email',
          title: 'required',
          name: 'required',
          contact_number: 'required|min:8|max:11',
          contact_code: 'required',
        };
        break;

      case 'switch-hospital':
        rules = {
          hospital_uuid: 'required|exist:Hospital,uuid',
        };
        break;

      case 'patient-login':
        rules = {
          email: 'required|exist:User,email',
          password: 'required|min:6',
        };
        break;

      case 'patient-signup':
        rules = {
          title: 'required',
          name: 'required',
          email: 'required|unique:User,email,is_active@false',
          password: 'required|min:6',
          confirm_password: 'required|min:6',
        };
        break;

      case 'verify-patient-signup':
        rules = {
          otp_uuid: 'required|exist:Otp,uuid',
          otp: 'required|min:4',
        };
        break;

      // case 'gmail-login':
      //   rules = {
      //     token_id: 'required',
      //   };
      //   break;

      case 'customer-signup':
        rules = {
          name: 'required',
          email: 'required|unique:Customer,email',
          password: 'required|min:6',
          phone_no: 'required|min:8|max:11',
        };
        break;
      case 'staff-forgot-password':
        rules = {
          email: 'required|exist:User,email',
        };
        break;

      case 'staff-change-password':
        rules = {
          uuid: 'required',
          password: 'required|min:6',
        };
        break;
      case 'validate-forgot-passsword-link':
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

module.exports = AuthValidator;
