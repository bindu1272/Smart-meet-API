const HospitalService = require("../../services/HospitalService");
const AuthService = require("../../services/AuthService");
const MediaService = require("../../services/MediaService");
const data = require("../api/data.json");
const app = require("../../../app");
const fs = require("fs");
const request = require("supertest");
const {
  WorkingHour,
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
const GenerateToken = require('../../tasks/Auth/GenerateToken');
const StaffService = require("../../services/StaffService");



const hospitalService = new HospitalService();
const authService = new AuthService();
const doctorService = new DoctorService();
const specializationRepo = new SpecializationRepository();
const workingHourRepo = new WorkingHourRepository();
const staffService = new StaffService();

let otpUuid = "";
let otp = "";
let hospitalId = "";
let hospitalUuid = "";

async function truncateTable(tableName) {
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

describe("Your test suite", () => {
  afterAll(async () => {
    // truncateTables();
   await truncateTable("doctor_delegates");
   await truncateTable("hospital_users");
   await truncateTable("hospitals");
   await truncateTable("invitation_links");
   await truncateTable("doctor_details");
   await truncateTable("doctor_specializations");
  });

  test("should create a user as Hospital valid Case and Invalid Case", async () => {
    try {
      // code that might throw an exception
      const res = await hospitalService.validateHospital(
        data?.doctorHospitalRegistrationStep1
      );
      expect(res?.owner).toBe(data?.doctorHospitalRegistrationStep1?.email);
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

  test("should validate a user as Hospital Invalid Case", async () => {
    try {
      // code that might throw an exception
      const res = await hospitalService.validateHospital({
        otp_uuid: otpUuid,
        otp: "1234",
        step: 2,
      });
      expect(res?.user).toBeNull();
      expect(res?.user?.email).toBeNull();
    } catch (error) {
      expect(error?.customCode).toBeNull();
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
        data?.doctorHospitalRegistrationAddress
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
        data?.doctorRegisterHospital
      );
      hospitalId = res?.id;
      hospitalUuid = res?.uuid;
      expect(res?.Hospital).not.toBeNull();
      expect(res?.Hospital?.slug).toBe(data?.doctorRegisterHospital?.slug);
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
    const res = await request(app)
      .get("/api/v1/doctors?page=1&limit=10")
      .set({ authorization: `${hospitalToken_type}  ${hospitalAccessToken}` })
      .send();
      expect(JSON.parse(res?.text)?.data).not.toBeNull();
      expect(JSON.parse(res?.text)?.data?.data).not.toBeNull();
      expect(JSON.parse(res?.text)?.data?.meta).not.toBeNull();
  });

  test("should get all specializations in this hospital", async () => {
    try {
      // code that might throw an exception
      const res = await specializationRepo.getFor();
      expect(res)?.not?.toBeNull();
      expect(res)?.toHaveLengthGreaterThan(1);
    } catch (error) {
    }
  });

  let doctor_link_uuid = "";
  test("POST /api/v1/doctors/invite should invite a doctor", async () => {
    const res = await request(app)
      .post("/api/v1/doctors/invite")
      .set({ authorization: `${hospitalToken_type}  ${hospitalAccessToken}` })
      .send(data?.inviteDoctor);
      expect(res?.body?.data?.uuid).not.toBeNull();
      expect(res?.body?.data?.email).not.toBeNull();
      expect(res?.body?.data?.email).toBe(data?.inviteDoctor?.email);
      expect(res?.body?.data?.owner_type).not.toBeNull();
      expect(res?.body?.data?.owner).not.toBeNull();
      expect(res?.body?.data?.email).not.toBeNull();
    doctor_link_uuid = res?.body?.data?.uuid;
  });
  
test("should register a user as Doctor Case ", async () => {
  try {
    // code that might throw an exception
    let dataDoctor = {...data?.registerDoctor,invite_link_uuid: doctor_link_uuid}
    const res = await doctorService.registerDoctor(dataDoctor);
  } catch (error) {
    console.log("doctorErrorRegitser",error);
  }
});


let doctorAccessToken = "";
let doctorTokenType = "";
test("should login a user as Doctor Case ", async () => {
  try {
    // code that might throw an exception
    const res = await authService.staffLogin(data?.loginDoctor);
    expect(res?.user).not.toBeNull();
    expect(res?.hospitals).not.toBeNull();
    let token_obj = await GenerateToken(
      res?.user,
      [App.helpers.config("settings.roles.doctor.value")],
      App.lodash.head(res?.hospitals),
      true
    );
    doctorAccessToken = token_obj?.access_token;
    doctorTokenType = token_obj?.token_type;
    expect(res?.user?.email).toBe(data?.loginDoctor?.email)
  } catch (error) {
    console.log("doctorErrorLogin",error);
  }
});

test("POST /api/v1/staffs/invite should invite a delegate", async () => {
  const res = await request(app)
    .post("/api/v1/staffs/invite")
    .set({ authorization: `${doctorTokenType}  ${doctorAccessToken}` })
    .send(data?.inviteDelegate);
  expect(res?.body?.data?.uuid).not.toBeNull();
  expect(res?.body?.data?.owner_type).not.toBeNull();
  expect(res?.body?.data?.owner).not.toBeNull();
  expect(res?.body?.data?.email).not.toBeNull();
  expect(res?.body?.data?.data).not.toBeNull();
  expect(res?.body?.data?.email).toBe(data?.inviteDelegate?.email);
});
});


test("should delete a user as Hospital", async () => {
  const res = await authService.destroy(data?.hospitalRegistrationStep1?.email);
  expect(res?.message).toBe("deleted successfully");
});

test("should delete a user as doctor", async () => {
  const res = await authService.destroy(data?.inviteDoctor?.email);
  expect(res?.message).toBe("deleted successfully");
});

test("should delete a Hospital working Hours", async () => {
  const res = await WorkingHour.destroy({ truncate: true });
});
