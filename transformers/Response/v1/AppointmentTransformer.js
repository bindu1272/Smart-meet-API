const BaseTransformer = require('./BaseTransformer');
const { Appointment } = require('../../../models');
const {
  ClaimRepository,
} = require('../../../repositories');



class AppointmentTransformer extends BaseTransformer {
  constructor(req, data, transformOptions = null) {
    super(req, data, transformOptions);
    this.model = Appointment;
    this.claimRepo = new ClaimRepository();
  }

  async transform(appointment) {
    appointment = await appointment;
    let returnVal = {
      id: App.lodash.get(appointment, 'uuid'),
      date: App.moment(
        App.lodash.get(appointment, 'date'),
        'YYYY-MM-DD'
      ).format('DD/MM/YYYY'),
      slot: App.lodash.get(appointment, 'slot'),
      appointment_id: App.lodash.get(appointment, 'appointment_id'),
      type: App.lodash.get(appointment, 'type'),
      consultation_type_name: App.lodash.find(
        App.helpers.config('settings.consultationMode'),
        ['value', App.lodash.get(appointment, 'type')]
      ),
      reschedule_reason: App.lodash.get(appointment, 'reschedule_reason'),
      cancel_reason: App.lodash.get(appointment, 'cancel_reason'),
      member_id : App.lodash.get(appointment,'member_id'),
      patient_answers: App.lodash.get(appointment,'patient_answers'),
      time: `${App.moment()
        .startOf('day')
        .add(App.lodash.get(appointment, 'slot') * 5, 'minutes')
        .format('HH:mm')}- ${App.moment()
        .startOf('day')
        .add(
          App.lodash.get(appointment, 'slot') * 5 +
            App.lodash.get(appointment, 'type'),
          'minutes'
        )
        .format('HH:mm')}`,
      status: App.lodash.find(
        App.helpers.config('settings.appointment_status'),
        ['value', App.lodash.get(appointment, 'status')]
      ),
    };

    if ('appointment_doctor' in appointment) {
      returnVal['doctor'] = await this.getDoctorDetails(
        appointment['appointment_doctor']
      );
    }
    if(appointment?.id){
      const claim = await this.claimRepo.getBy({
        appointment_id : App.lodash.get(appointment,"id")
      })
      returnVal["claim"] = claim;
    }

    if ('appointment_hospital' in appointment) {
      returnVal['hospital'] = await this.getHospitalDetails(
        appointment['appointment_hospital']
      );
    }

    if (
      'appointment_notes' in appointment &&
      appointment['appointment_notes']
    ) {
      returnVal['appointment_notes'] = await this.getAppointmentNotes(
        appointment['appointment_notes']
      );
    }
    if('appointment_claim' in appointment && appointment['appointment_claim']){
      returnVal['appointment_claim'] = await this.getAppointmentClaim(
        appointment['appointment_claim']
      )
    }

    if ('appointment_member' in appointment && appointment["appointment_member"] != null) {
      returnVal['patient'] = await this.getPatient(
        appointment['appointment_member']
      );
    }

    if (
      'appointment_ratings' in appointment &&
      appointment['appointment_ratings']
    ) {
      returnVal['is_rating_done'] =
        appointment['appointment_ratings'].length > 0 ? true : false;
      returnVal['appointment_rating'] = appointment['appointment_ratings'][0];
    }

    return returnVal;
  }

  async getAppointmentNotes(appointmentNotes) {
    let transformer = require('./AppointmentNoteTransformer');
    return await new transformer(this.req, appointmentNotes, {}).init();
  }
  async getAppointmentClaim(appointmentClaim) {
    let transformer = require('./ClaimTransformer');
    return await new transformer(this.req, appointmentClaim, {}).init();
  }

  async getDoctorDetails(doctor) {
    let transformer = require('./UserTransformer');
    return await new transformer(this.req, doctor, {}).init();
  }

  async getPatient(patient) {
    let transformer = require('./MemberTransformer');
    return await new transformer(this.req, patient, {}).init();
  }

  async getHospitalDetails(hospital) {
    let transformer = require('./HospitalTransformer');
    return await new transformer(this.req, hospital, {}).init();
  }
}

module.exports = AppointmentTransformer;
