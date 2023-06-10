const BaseTransformer = require('./BaseTransformer');
const { Claim } = require('../../../models');
const {
  AppointmentRepository,
  MemberRepository,
} = require('../../../repositories');

class ClaimTransformer extends BaseTransformer {
  constructor(req, data, transformOptions = null) {
    super(req, data, transformOptions);
    this.model = Claim;
    this.appointmentRepo = new AppointmentRepository();
    this.memberRepo = new MemberRepository();
  }
  async transform(claim) {
    claim = await claim;
    let returnVal = {
      id: App.lodash.get(claim, 'id'),
      type: App.lodash.get(claim, 'type'),
      service_type: App.lodash.get(claim, 'service_type'),
      start_date : App.lodash.get(claim,'start_date'),
      end_date : App.lodash.get(claim,'end_date'),
      items : App.lodash.get(claim,'items'),
      claimed_amount : App.lodash.get(claim,'claimed_amount'),
      received_amount : App.lodash.get(claim,'recieved_amount')
    };
    if ('appointment_id' in claim) {
      const appointment = await this.appointmentRepo.getBy({
          id : App.lodash.get(claim, "appointment_id")
        })
      returnVal['claim_appointment'] = await this.getAppointment(
        appointment
      );
    }
    return returnVal;
  }
  async getAppointment(appointment) {
    if (!appointment) {
      return null;
    }
    if ('member_id' in appointment) {
      const appointment_member = await this.memberRepo.getBy({
          id : App.lodash.get(appointment, "member_id")
        })
      appointment['appointment_member'] = await this.getMember(
        appointment_member
      );
    }
    let transformer = require('./AppointmentTransformer');
    return await new transformer(this.req, appointment, {}).init();
  }
  async getMember(member) {
    if (!member) {
      return null;
    }
    let transformer = require('./MemberTransformer');
    return await new transformer(this.req, member, {}).init();
  }
}

module.exports = ClaimTransformer;
