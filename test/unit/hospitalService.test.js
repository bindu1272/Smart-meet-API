const HospitalService = require("../../services/HospitalService");
const AuthService = require("../../services/AuthService");
const MediaService = require("../../services/MediaService");
const data = require("../api/data.json");
const fs = require("fs");
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

describe("Hospital Service test suite", () => {
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
        data?.hospitalRegistrationStep1
      );
      expect(res?.owner).toBe(data?.hospitalRegistrationStep1?.email);
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
      expect(res?.media_type).toBeNull();
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
        data?.hospitalRegistrationAddress
      );
    } catch (error) {
      console.log("hospitalAddress", error);
    }
  });

  test("should register a Hospital Case", async () => {
    try {
      // code that might throw an exception
      const res = await hospitalService.registerHospital(
        data?.registerHospital
      );
      hospitalId = res?.id;
      hospitalUuid = res?.uuid;
      expect(res?.Hospital).not.toBeNull();
      expect(res?.Hospital?.uuid).not.toBeNull();
      expect(res?.Hospital?.name).not.toBeNull();
      expect(res?.Hospital?.contact_code).toBe(data?.registerHospital?.contact_code);
      expect(res?.Hospital?.fax_number).toBe(data?.registerHospital?.fax_number);
      expect(res?.Hospital?.contact_number).toBe(data?.registerHospital?.contact_number);
      expect(res?.Hospital?.slug).toBe(data?.registerHospital?.slug);
    } catch (error) {
      console.log("resgiterError", error);
    }
  });

  // test("should register a Hospital Invalid Case", async () => {
  //   try {
  //     // code that might throw an exception
  //     const res = await hospitalService.registerHospital(
  //       data?.invalidRegisterHospital
  //     );
  //   } catch (error) {
  //     console.log("hospitalInvalid", error);
  //   }
  // });

  test("should login a user as  SuperAdmin valid Case ", async () => {
    const res = await authService.staffLogin(data?.loginSuperAdmin);
    expect(res?.user).not.toBeNull();
    expect(res?.user?.email).toBe(data?.loginSuperAdmin?.email);
    expect(res?.user?.password).not.toBeNull();
    expect(res?.user?.uuid).not.toBeNull();
    expect(res?.user?.name).not.toBeNull();
  });

  test("should login a user as  SuperAdmin Invalid Case ", async () => {
    try {
      const res = await authService.staffLogin(data?.invalidLoginSuperAdmin);
    } catch (error) {
      expect(error?.customCode).toBeNull();
    }
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

  test("should verify  hospital as Invalid Case", async () => {
    try {
      const verifyHospitalData = {
        billing_method: 1,
        billing_unit_amount: 100,
        verified: 1,
        uuid: "",
      };
      const res = await hospitalService.updateHospitalStatus(
        verifyHospitalData
      );
    } catch (error) {
      expect(error?.errors?.uuid?.[0]).toBe("The uuid field is required.");
      expect(error?.customCode).toBeNull();
    }
  });
});

test("should delete a user as Hospital", async () => {
  const res = await authService.destroy(data?.hospitalRegistrationStep1?.email);
  expect(res?.message).toBe("deleted successfully");
});

test("should delete a Hospital working Hours", async () => {
  const res = await WorkingHour.destroy({ truncate: true });
});
