const HospitalService = require("../../services/HospitalService");
const AuthService = require("../../services/AuthService");
const MediaService = require("../../services/MediaService");
const data = require("../api/data.json");
const app = require("../../../app");
const fs = require("fs");
const request = require("supertest");
const {
  Hospital,
  User,
  WorkingHour,
  HospitalUser,
  sequelize,
} = require("../../models");
const {
  SpecializationRepository,
  WorkingHourRepository,
} = require("../../repositories");
require("../../providers/CustomValidatorServiceProvider");
const path = require("path");
const { QueryTypes } = require("sequelize");
const DoctorService = require("../../services/DoctorService");
const GenerateToken = require("../../tasks/Auth/GenerateToken");
const StaffService = require("../../services/StaffService");
const AppointmentService = require("../../services/AppointmentService");
var moment = require("moment");

const hospitalService = new HospitalService();
const authService = new AuthService();
const doctorService = new DoctorService();
const appointmentService = new AppointmentService();
const specializationRepo = new SpecializationRepository();
const workingHourRepo = new WorkingHourRepository();
const staffService = new StaffService();

let otpUuid = "";
let otp = "";
let hospitalId = "";
let hospitalUuid = "";

async function truncateTable(tableName) {
  console.log("truncate12",tableName);
  await sequelize.query("SET FOREIGN_KEY_CHECKS = 0", {
    raw: true,
    type: QueryTypes.RAW,
  });
  await sequelize.query(`TRUNCATE TABLE ${tableName}`, {
    raw: true,
    type: QueryTypes.RAW,
  });
  await sequelize.query("SET FOREIGN_KEY_CHECKS = 1", {
    raw: true,
    type: QueryTypes.RAW,
  });
}

describe("Appointments test suite", () => {
  afterAll(async () => {
    // truncateTables();
    await truncateTable("doctor_delegates");
    await truncateTable("hospital_users");
    await truncateTable("hospitals");
    await truncateTable("invitation_links");
    await truncateTable("doctor_details");
    await truncateTable("doctor_specializations");
    await truncateTable("appointments");
    await truncateTable("members");
  });

  test("should create a user as Hospital valid Case and Invalid Case", async () => {
    try {
      // code that might throw an exception
      const res = await hospitalService.validateHospital(
        data?.appointmentHospitalRegistrationStep1
      );
      expect(res?.owner).toBe(data?.appointmentHospitalRegistrationStep1?.email);
      expect(res?.otp).not.toBeNull();
      expect(res?.media_type).not.toBeNull();
      expect(res.owner_type).not.toBeNull();
      expect(res.status).toBe(0);
      expect(res.uuid).not.toBeNull();
      otp = res?.otp;
      otpUuid = res?.uuid;
    } catch (error) {
      console.log("hospitalRegister ", error);
    }
  });

  test("should validate a user as Hospital valid case", async () => {
    try {
      const res = await hospitalService.validateHospital({
        otp_uuid: otpUuid,
        otp: otp,
        step: 2,
      });
    } catch (error) {
      expect(error?.customCode).not.toBeNull();
    }
  });

  test("should validate a Hospital image upload Case", async () => {
    try {
      const fileName = "candles.jpg";
      const filePath = path.join(__dirname, fileName);
      fs.writeFileSync(filePath, "This is a test file.");
      const req = {
        headers: {
          "content-type":
            "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW",
        },
      };
      req.file = data?.hospitalImageUpload;
      const service = new MediaService(req);
      const res = await service.upload();
      expect(res?.public_id).not.toBeNull();
      expect(res?.url).not.toBeNull();
      expect(res?.format).toBe("jpg");
      expect(res?.type).toBe("upload");
      expect(res?.api_key).not.toBeNull();
    } catch (error) {
      console.log("mediaerror", error);
    }
  });

  test("should validate a Hospital address  Case", async () => {
    try {
      // code that might throw an exception
      const res = await hospitalService.validateHospital(
        data?.appointmentHospitalRegistrationAddress
      );
    } catch (error) {
      console.log("hospitalAddress", error);
      // expect(error?.customCode).toBeNull();
    }
  });

  test("should register a Hospital Case", async () => {
    try {
      // code that might throw an exception
      const res = await hospitalService.registerHospital(
        data?.appointmentRegisterHospital
      );
      hospitalId = res?.id;
      hospitalUuid = res?.uuid;
      expect(res?.Hospital).not.toBeNull();
      expect(res?.Hospital?.slug).toBe(data?.appointmentRegisterHospital?.slug);
    } catch (error) {
      console.log("resgiterError", error);
    }
  });

  test("should login a user as  SuperAdmin  Case ", async () => {
    const res = await authService.staffLogin(data?.loginSuperAdmin);
    expect(res?.user).not.toBeNull();
    expect(res?.user?.email).toBe(data?.loginSuperAdmin?.email);
  });

  test("should verify  hospital", async () => {
    try {
      const verifyHospitalData = {
        billing_method: 1,
        billing_unit_amount: 100,
        verified: 1,
        uuid: hospitalUuid,
      };
      const res = await hospitalService.updateHospitalStatus(
        verifyHospitalData
      );
      expect(res).toBe("Verified");
    } catch (error) {
      console.log("verifyError", error);
    }
  });

  let hospitalAccessToken = "";
  let hospitalToken_type = "";
  test("should login a user as  Hospital Case with Verification", async () => {
    try {
      // code that might throw an exception
      const res = await authService.staffLogin(data?.loginHospital);
      expect(res?.user).not.toBeNull();
      expect(res?.user?.email).toBe(data?.loginHospital?.email);
      let token_obj = await GenerateToken(
        res?.user,
        [App.helpers.config("settings.roles.admin.value")],
        App.lodash.head(res?.hospitals),
        true
      );
      expect(token_obj?.access_token).not.toBeNull();
      expect(token_obj?.token_type).not.toBeNull();
      hospitalAccessToken = token_obj.access_token;
      hospitalToken_type = token_obj?.token_type;
    } catch (error) {
      console.log("loginerror", error);
    }
  });

  test("GET /api/v1/doctors should get all doctors", async () => {
    try{
    const res = await request(app)
      .get("/api/v1/doctors?page=1&limit=10")
      .set({ authorization: `${hospitalToken_type}  ${hospitalAccessToken}` })
      .send();
    expect(JSON.parse(res?.text)?.data).not.toBeNull();
    expect(JSON.parse(res?.text)?.data?.data).not.toBeNull();
    expect(JSON.parse(res?.text)?.data?.meta).not.toBeNull();
    }catch(error){
      console.log("get all doctors",error);
    }
  });

  test("should get all specializations in this hospital", async () => {
    try {
      // code that might throw an exception
      const res = await specializationRepo.getFor();
      expect(res)?.toHaveLengthGreaterThan(1);
    } catch (error) {}
  });

  let doctor_link_uuid = "";
  test("POST /api/v1/doctors/invite should invite a doctor", async () => {
    const res = await request(app)
      .post("/api/v1/doctors/invite")
      .set({ authorization: `${hospitalToken_type}  ${hospitalAccessToken}` })
      .send(data?.inviteDoctor);
    doctor_link_uuid = res?.body?.data?.uuid;
    console.log("invite Doctor", res?.body?.data);
  });

  test("should register a user as Doctor Case ", async () => {
    try {
      // code that might throw an exception
      let dataDoctor = {
        ...data?.registerDoctor,
        invite_link_uuid: doctor_link_uuid,
      };
      const res = await doctorService.registerDoctor(dataDoctor);
    } catch (error) {
      console.log("doctorErrorRegitser", error);
    }
  });
  let hospital_uuid = "";

  let doctorAccessToken = "";
  let doctorTokenType = "";
  test("should login a user as Doctor Case ", async () => {
    try {
      // code that might throw an exception
      const res = await authService.staffLogin(data?.loginDoctor);
      let token_obj = await GenerateToken(
        res?.user,
        [App.helpers.config("settings.roles.doctor.value")],
        App.lodash.head(res?.hospitals),
        true
      );
      doctorAccessToken = token_obj?.access_token;
      doctorTokenType = token_obj?.token_type;
      expect(res?.user?.email).toBe(data?.loginDoctor?.email);
    } catch (error) {
      console.log("doctorErrorLogin", error);
    }
  });

  let doctor_uuid = "";
  let doctor_id = "";
  test("GET /api/v1/doctors should get all doctors Case ", async () => {
    try {
      // code that might throw an exception
      const res = await request(app)
        .get("/api/v1/doctors")
        .set({ authorization: `${hospitalToken_type}  ${hospitalAccessToken}` })
        .send();
      doctor_uuid = JSON.parse(res?.text)?.data?.data?.[0]?.id;
      expect(JSON.parse(res?.text)?.code).toBe(200);
      expect(JSON.parse(res?.text)?.data).not.toBeNull();
    } catch (error) {
      console.log("getAllDoctorsError", error);
    }
  });

  test(
    "PUT /api/v1/doctors/" +
      doctor_uuid +
      "/working-hours should setAvaialability for Doctors valid Case",
    async () => {
      try {
        const availability = { ...data?.doctorAvailability, uuid: doctor_uuid };
        const res = await request(app)
          .put("/api/v1/doctors/" + doctor_uuid + "/working-hours")
          .set({ authorization: `${doctorTokenType}  ${doctorAccessToken}` })
          .send(availability);
        expect(res?.request?._data).not.toBeNull();
        expect(res?.request?._data?.appointment_duration).not.toBeNull();
        expect(res?.request?._data?.availability).not.toBeNull();
      } catch (error) {
        console.log("setAvailability", error);
        expect(error?.user).toBeNull();
      }
    }
  );

  test(
    "GET /api/v1/doctors/" +
      doctor_uuid +
      "/monthly-availability/"+hospitalUuid+ "should getMonthlyAvaialability for Doctors valid Case",
    async () => {
      try {
        const date = "2023-5-27";
        const res = await request(app)
          .get("/api/v1/doctors/" + doctor_uuid + "/monthly-availability/"+hospitalUuid+"?date="+date)
          .set({ authorization: `${doctorTokenType}  ${doctorAccessToken}` })
          .send();
        expect(JSON.parse(res?.text)?.data).not.toBeNull();
      } catch (error) {
        console.log("monthly-available", error);
      }
    }
  );

  let userUuid = "";
  let otp = "";

  test("should create a user as patient valid Case and Invalid Case", async () => {
    try {
      // code that might throw an exception
      const res = await authService.patientSignUp(data?.patientSignup);
      expect(res.owner).toBe(data?.patientSignup?.email);
      expect(res.otp).not.toBeNull();
      expect(res.media_type).not.toBeNull();
      expect(res.owner_id).not.toBeNull();
      expect(res.owner_type).not.toBeNull();
      expect(res.status).toBe(0);
      expect(res.uuid).not.toBeNull();
      otp = res.otp;
      userUuid = res.uuid;
    } catch (error) {
      expect(error?.status).toBe(422);
      expect(error?.customCode).toBeNull();
      expect(error?.errors?.email?.[0]).toBe(
        "The email has already been taken."
      );
    }
  });

  test("should validate a user as patient valid case", async () => {
    try {
      // code that might throw an exception
      const res = await authService.validatePatientSignUp({
        otp_uuid: userUuid,
        otp: otp,
      });
      expect(res?.user).not.toBeNull();
      expect(res?.user?.email).toBe(data?.patientSignup?.email);
    } catch (error) {
      expect(error?.customCode).toBeNull();
    }
  });

  let patient_token_type = "";
  let patient_access_token = "";
  test("should login a user as patient valid Case", async () => {
    try {
      const res = await authService.patientLogin(data?.patientLogin);
      expect(res?.user).not.toBeNull();
      expect(res?.user?.email).toBe(data?.patientSignup?.email);
      let token_obj = await GenerateToken(
        res?.user,
        [App.helpers.config('settings.roles.patient.value')],
        [],
        false
      );
      expect(token_obj?.access_token).not.toBeNull();
      expect(token_obj?.token_type).not.toBeNull();
      patient_access_token = token_obj.access_token;
      patient_token_type = token_obj?.token_type;
    } catch (error) {
      expect(error?.user).toBeNull();
    }
  });

  test("should get Doctors hospital valid case", async () => {
    try {
      // code that might throw an exception
      const doctor_id = await doctorService.getDoctorUserId({"doctor_uuid":doctor_uuid});
      const res = await hospitalService.getDoctorsHospital({userId : doctor_id});
      expect(res?.contact_hours).not.toBeNull();
    } catch (error) {
      console.log("getDoct",error);
    }
  });

  test(
    "GET /api/v1/doctors/appointment-slots/should get doctor appointment slots valid Case",
    async () => {
      try {
        var date = new moment().format("YYYY-MM-DD");
        const res = await request(app)
          .get("/api/v1/doctors/" + doctor_uuid + "/appointment-slots/"+hospitalUuid+"?date="+date)
          .set({ authorization: `${patient_token_type}  ${patient_access_token}` })
          .send();
        expect(JSON.parse(res?.text)?.data).not.toBeNull();
      } catch (error) {
        console.log("appointment slots", error);
      }
    }
  );

let appointmentOtpUuid ="";
let appointmentOtp="";
  test("should create a appointment for patient Myself valid Case", async () => {
    try {
      const createAppointmentData = {...data?.createAppointment,doctor_uuid:doctor_uuid,hospital_uuid:hospitalUuid}
      const res = await appointmentService.createAppointment(createAppointmentData);
      expect(res?.uuid).not.toBeNull();
      expect(res?.otp).not.toBeNull();
      expect(res?.owner).toBe(data?.createAppointment?.email);
      appointmentOtpUuid = res?.uuid;
      appointmentOtp = res?.otp;
    } catch (error) {
      console.log("appointment",error);
    }
  });

  test("should validate a appointment for patient Myself valid Case", async () => {
    try {
      const validateAppointment = {otp_uuid : appointmentOtpUuid,otp:appointmentOtp}
      const res = await appointmentService.validateAppointment(validateAppointment);
    } catch (error) {
      console.log("appointment validation",error);
    }
  });

  let familyAppointmentOtpUuid = "";
  let familyAppointmentOtp = "";
  test("should create a appointment for patient Family valid Case", async () => {
    try {
      const createAppointmentData = {...data?.createFamilyAppointment,doctor_uuid:doctor_uuid,hospital_uuid:hospitalUuid}
      const res = await appointmentService.createAppointment(createAppointmentData);
      expect(res?.uuid).not.toBeNull();
      expect(res?.otp).not.toBeNull();
      expect(res?.owner).toBe(data?.createAppointment?.email);
      familyAppointmentOtpUuid = res?.uuid;
      familyAppointmentOtp = res?.otp;
    } catch (error) {
      console.log("familyAppointment",error);
    }
  });

  test("should validate a appointment for patient Family valid Case", async () => {
    try {
      const validateAppointment = {otp_uuid : familyAppointmentOtpUuid,otp:familyAppointmentOtp}
      const res = await appointmentService.validateAppointment(validateAppointment);
    } catch (error) {
      console.log("appointment validation",error);
    }
  });

  test("should delete a user", async () => {
    const res = await authService.destroy(data?.patientSignup?.email);
    expect(res.message).toBe("deleted successfully");
  });
});

test("should delete a user as Hospital", async () => {
  const res = await authService.destroy(data?.appointmentHospitalRegistrationStep1?.email);
  expect(res?.message).toBe("deleted successfully");
});

test("should delete a user as doctor", async () => {
  const res = await authService.destroy(data?.inviteDoctor?.email);
  expect(res?.message).toBe("deleted successfully");
});
test("should delete a user as doctor delegate", async () => {
  const res = await authService.destroy(data?.inviteDelegate?.email);
  expect(res?.message).toBe("deleted successfully");
});

test("should delete a Hospital working Hours", async () => {
  const res = await WorkingHour.destroy({ truncate: true });
});
