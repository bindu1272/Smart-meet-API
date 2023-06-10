const { Claim } = require("../../models");
const {
  AppointmentRepository,
  MemberRepository,
  DoctorDetailRepository,
  UserRepository,
  HospitalRepository,
} = require("../../repositories");
const getAppointmentMember = async (appointment) => {
  this.appointmentRepo = new AppointmentRepository();
  this.memberRepo = new MemberRepository();
  if (!appointment) {
    return null;
  }
  if ("member_id" in appointment) {
    const appointment_member = await this.memberRepo.getBy({
      id: App.lodash.get(appointment, "member_id"),
    });
    return (appointment["appointment_member"] = await getMember(
      appointment_member
    ));
  }
  let transformer = require("../../transformers/Response/v1/AppointmentTransformer");
  return await new transformer(this.req, appointment, {}).init();
};
const getAppointmentDoctor = async (appointment) => {
  this.appointmentRepo = new AppointmentRepository();
  this.userRepo = new UserRepository();
  this.doctorDetailRepo = new DoctorDetailRepository();
  if (!appointment) {
    return null;
  }
  if ("doctor_id" in appointment) {
    const appointment_doctor_user = await this.userRepo.getBy({
      id: App.lodash.get(appointment, "doctor_id"),
    });
    if (appointment_doctor_user?.id) {
      const appointment_doctor = await this.doctorDetailRepo.getBy({
        user_id: App.lodash.get(appointment, "doctor_id"),
      });
      return (appointment["appointment_doctor"] = await getDoctorDetail(
        appointment_doctor
      ));
    }
  }
  let transformer = require("../../transformers/Response/v1/AppointmentTransformer");
  return await new transformer(this.req, appointment, {}).init();
};
const getAppointmentHospital = async (appointment) => {
  this.appointmentRepo = new AppointmentRepository();
  this.hospitalRepo = new HospitalRepository();
  if (!appointment) {
    return null;
  }
  if ("hospital_id" in appointment) {
    const appointment_hospital = await this.hospitalRepo.getBy({
      id: App.lodash.get(appointment, "hospital_id"),
    });
    return (appointment["appointment_hospital"] = await getHospital(
      appointment_hospital
    ));
  }
  let transformer = require("../../transformers/Response/v1/AppointmentTransformer");
  return await new transformer(this.req, appointment, {}).init();
};
const getMember = async (member) => {
  if (!member) {
    return null;
  }
  let transformer = require("../../transformers/Response/v1/MemberAdditionalTransformer");
  return await new transformer(this.req, member, {}).init();
};
const getDoctorDetail = async (doctor_detail) => {
  if (!doctor_detail) {
    return null;
  }
  let transformer = require("../../transformers/Response/v1/DoctorDetailTransformer");
  return await new transformer(this.req, doctor_detail, {}).init();
};
const getHospital = async (hospital) => {
  if (!hospital) {
    return null;
  }
  let transformer = require("../../transformers/Response/v1/HospitalTransformer");
  return await new transformer(this.req, hospital, {}).init();
};

module.exports = async (claim) => {
  this.model = Claim;
  this.appointmentRepo = new AppointmentRepository();
  this.memberRepo = new MemberRepository();
  let returnVal = {
    id: App.lodash.get(claim, "id"),
    type: App.lodash.get(claim, "type"),
    service_type: App.lodash.get(claim, "service_type"),
    start_date: App.lodash.get(claim, "start_date"),
    end_date: App.lodash.get(claim, "end_date"),
    items: App.lodash.get(claim, "items"),
    claimed_amount: App.lodash.get(claim, "claimed_amount"),
    received_amount: App.lodash.get(claim, "received_amount"),
    claim_type: App.lodash.get(claim, "claim_type"),
  };
  if ("appointment_id" in claim) {
    const appointment = await this.appointmentRepo.getBy({
      id: App.lodash.get(claim, "appointment_id"),
    });
    returnVal["claim_appointment_member"] = await getAppointmentMember(
      appointment
    );
    returnVal["claim_appointment_doctor"] = await getAppointmentDoctor(
      appointment
    );
    returnVal["claim_appointment_hospital"] = await getAppointmentHospital(
      appointment
    )
  }
  return returnVal;
};
