var Validator = require('./Validator');

class AppointmentValidator extends Validator {
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
      case 'rescheduled-appointment':
        rules = {
          uuid: 'required|exist:Appointment,uuid',
          date: 'required',
          slot_id: 'required|numeric',
        };
        break;
      case 'cancel-appointment':
        rules = {
          uuid: 'required|exist:Appointment,uuid',
        };
        break;

      case 'create-appointment':
        rules = {
          email: 'required|email',
          doctor_uuid: 'required|exist:User,uuid',
          hospital_uuid: 'required|exist:Hospital,uuid',
          contact_code: 'required',
          contact_number: 'required|min:8|max:11',
          // consultation_mode: `required|in:${App.lodash
          //   .map(App.helpers.config('settings.consultationMode'), 'value')
          //   .join(',')}`,
          consultation_type: `required|in:${App.lodash
            .map(App.helpers.config('settings.consultationFor'), 'value')
            .join(',')}`,
        };
        break;

      case 'patient-details':
        rules = {
          name: 'required',
          relation: 'required',
          // age: 'required|numeric',
          gender: 'required|in:M,F,O',
          contact_number: 'required|min:8|max:11',
        };
        break;

      case 'update-appointment-status':
        rules = {
          uuid: `required|exist_in:Appointment,uuid,hospital_id@${App.lodash.get(
            data,
            'hospital_id'
          )}`,
          status: `required|in:${App.lodash
            .map(App.helpers.config('settings.appointment_status'), 'value')
            .join(',')}`,
        };
        break;

      case 'validate-appointment':
        rules = {
          otp_uuid: 'required',
          otp: 'required|numeric',
        };
        break;

      case 'add-appointment-note':
        rules = {
          notes: 'required',
          appointment_uuid: `required|exist_in:Appointment,uuid,hospital_id@${App.lodash.get(
            data,
            'hospital_id'
          )}&&doctor_id@${App.lodash.get(data, 'doctor_id')}`,
        };
        break;

      case 'update-appointment-note':
        rules = {
          uuid: 'required|exist:AppointmentNote,uuid',
          notes: 'required',
          appointment_uuid: `required|exist_in:Appointment,uuid,hospital_id@${App.lodash.get(
            data,
            'hospital_id'
          )}&&doctor_id@${App.lodash.get(data, 'doctor_id')}`,
        };
        break;

      case 'get-patient-notes':
        rules = {
          uuid: 'required|exist:Member,uuid',
        };
        break;

      case 'create-rating':
        rules = {
          uuid: 'required|exist:Appointment,uuid',
          appointment_rating: 'required|numeric',
          hospital_rating: 'required|numeric',
        };
        break;

      case 'hospital-reviews':
        rules = {
          uuid: 'required|exist:Hospital,uuid',
        };
        break;
      case 'doctor-reviews':
        rules = {
          uuid: 'required|exist:User,uuid',
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

module.exports = AppointmentValidator;
