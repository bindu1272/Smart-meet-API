var Validator = require('./Validator');

class HospitalValidator extends Validator {
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
      case 'validate-step':
        rules = {
          step: 'required|in:1,2,3,4',
        };
        break;

      case 'validate-update-step':
        rules = {
          uuid: 'required|exist:Hospital,uuid',
          step: 'required|in:1,2,3,4',
        };
        break;

      case 'hospital-exists':
        rules = {
          uuid: 'required|exist:Hospital,uuid',
        };
        break;

      case 'update-hospital-status':
        rules = {
          uuid: 'required|exist:Hospital,uuid',
          verified: `required|in:${App.lodash
            .map(App.helpers.config('settings.hospital_status'), 'value')
            .join(',')}`,
        };
        break;

      case 'bill-details':
        rules = {
          billing_method: `required|in:${App.lodash
            .map(App.helpers.config('settings.billingMethods'), 'value')
            .join(',')}`,
          billing_unit_amount: 'required|numeric',
        };
        break;

      case 'validate-hospital-admin':
        rules = {
          title: 'required',
          name: 'required',
          email: 'required|email', //validate_hospital_admin_email
          contact_number: 'required|min:8|max:11',
          contact_code: 'required',
          password: 'required|min:6',
          confirm_password: 'required|min:6',
        };
        break;

      case 'validate-registration-otp':
        rules = {
          otp: 'required|min:4|numeric',
          otp_uuid: 'required|exist:Otp,uuid',
        };
        break;

      case 'validate-hospital-details':
        rules = {
          name: 'required',
          specialisations: 'required|exist_in:Specialization,uuid',
          city_uuid: 'required|exist:City,uuid',
          description: 'required',
          address_1: 'required',
          suburb: 'required',
          state: 'required',
          country: 'required',
          doctor_count: 'required|numeric',
          contact_code: 'required',
          contact_number: 'required|numeric|min:8',
          sponsership_required: 'required|boolean',
          working_hours: 'required',
          billing_method: `required|in:${App.lodash
            .map(App.helpers.config('settings.billingMethods'), 'value')
            .join(',')}`,
        };
        break;

      case 'update-hospital-1':
        rules = {
          name: 'required',
          specialisations: 'required|exist_in:Specialization,uuid',
          city_uuid: 'required|exist:City,uuid',
          description: 'required',
          address_1: 'required',
          suburb: 'required',
          state: 'required',
          country: 'required',
          doctor_count: 'required|numeric',
          contact_code: 'required',
          contact_number: 'required|numeric',
          sponsership_required: 'required|boolean',
          working_hours: 'required',
        };
        break;

      case 'update-hospital-2':
        rules = {
          slug: `required|unique:Hospital,slug,id@${App.lodash.get(
            data,
            'hospital.id'
          )}`,
        };
        break;

      case 'update-hospital-3':
        rules = {
          appointment_booking_duration: 'required|numeric',
          appointment_cancellation_duration: 'required|numeric',
        };
        break;

      case 'validate-hospital-personalisation':
        rules = {
          slug: 'required|unique:Hospital,slug',
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

module.exports = HospitalValidator;
