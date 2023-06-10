const AuthService = require("../../services/AuthService");
const MemberService = require("../../services/MemberService");
const data = require("../api/data.json");
require("../../providers/CustomValidatorServiceProvider");
const { QueryTypes } = require("sequelize");
const { sequelize } = require("../../models");

const authService = new AuthService();
const memberService = new MemberService();
let otpUserUuid = "";
let otp = "";
let userUuid = "";

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

describe("member Service test suite", () => {
  afterAll(async () => {
    // truncateTables();
    await truncateTable("members");
    await truncateTable("otps");
  });

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
      otpUserUuid = res.uuid;
    } catch (error) {
      expect(error?.status).toBe(422);
      expect(error?.customCode).toBeNull();
      expect(error?.errors?.email?.[0]).toBe(
        "The email has already been taken."
      );
    }
  });

  test("should create a user as patient while resend Otp", async () => {
    try {
      // code that might throw an exception
      const res = await authService.resendOtp({ uuid: otpUserUuid });
      expect(res.owner).toBe(data?.patientSignup?.email);
      expect(res.otp).not.toBeNull();
      expect(res.media_type).not.toBeNull();
      expect(res.owner_id).not.toBeNull();
      expect(res.owner_type).not.toBeNull();
      expect(res.status).toBe(0);
      expect(res.uuid).not.toBeNull();
      otp = res.otp;
      otpUserUuid = res.uuid;
    } catch (error) {
      expect(error?.customCode).toBeNull();
      expect(error?.errors?.uuid?.[0]).toBe("The uuid field is required.");
    }
  });

  test("should validate a user as patient valid case", async () => {
    try {
      // code that might throw an exception
      const res = await authService.validatePatientSignUp({
        otp_uuid: otpUserUuid,
        otp: otp,
      });
      expect(res?.user).not.toBeNull();
      expect(res?.user?.email).toBe(data?.patientSignup?.email);
    } catch (error) {
      expect(error?.customCode).toBeNull();
    }
  });

  test("should validate a user as patient Invalid Case", async () => {
    try {
      // code that might throw an exception
      const res = await authService.validatePatientSignUp({
        otp_uuid: otpUserUuid,
        otp: "1234",
      });
      expect(res?.user).not.toBeNull();
      expect(res?.user?.email).toBe(data?.patientSignup?.email);
    } catch (error) {
      expect(error?.customCode).toBeNull();
    }
  });

  test("should login a user as patient valid Case", async () => {
    try {
      const res = await authService.patientLogin(data?.patientLogin);
      expect(res?.user).not.toBeNull();
      expect(res?.user?.email).toBe(data?.patientSignup?.email);
      userUuid = res?.user?.uuid;
    } catch (error) {
      expect(error?.user).toBeNull();
    }
  });

  test("should login a user as patient inValid Case", async () => {
    try {
      const res = await authService.patientLogin(data?.invalidPatientLogin);
      expect(res?.user).toBeNull();
      expect(res?.user?.email).toBeNull();
    } catch (error) {
      expect(error?.customCode).toBeNull();
    }
  });

  test("should create a user as member Case", async () => {
    try {
      const res = await memberService.createMember(data?.createMember);
    } catch (error) {
      expect(error?.customCode).toBeNull();
    }
  });

  let patientMemberUuid = "";
  test("should get all patient members Case", async () => {
    try {
      const res = await memberService.getPatientMembers();
      patientMemberUuid = res?.[0]?.uuid;
    } catch (error) {
      expect(error?.customCode).toBeNull();
    }
  });

  test("should update a patient members Case", async () => {
    try {
      const updateMember = { uuid: patientMemberUuid };
      const res = await memberService.updateMember(updateMember);
    } catch (error) {
      expect(error?.customCode).toBeNull();
    }
  });

  test("should add a user as patient additional Details case", async () => {
    try {
      const patientAdditionalDetails = {
        ...data?.patientAdditionalDetails,
        user_id: userUuid,
      };
      const res = await memberService.createAdditionalDetails(
        patientAdditionalDetails
      );
    } catch (error) {
      expect(error?.customCode).toBeNull();
    }
  });
  let memberUuid = "";
  test("should get a user as patient additional Details case", async () => {
    try {
      const patientAdditionalDetails = { userUuid: userUuid };
      const res = await memberService.getAdditionalDetails(
        patientAdditionalDetails
      );
      memberUuid = res?.uuid;
      expect(res?.d_v_a_file_number).toBe(
        data?.patientAdditionalDetails?.d_v_a_file_number
      );
      expect(res?.irn_number).toBe(data?.patientAdditionalDetails?.irn_number);
      expect(res?.primary_language).toBe(
        data?.patientAdditionalDetails?.primary_language
      );
      expect(res?.pension_card_number).toBe(
        data?.patientAdditionalDetails?.pension_card_number
      );
      expect(res?.healthcare_card_number).toBe(
        data?.patientAdditionalDetails?.healthcare_card_number
      );
    } catch (error) {
      expect(error?.customCode).toBeNull();
    }
  });
  test("should update a user as patient additional Details case", async () => {
    try {
      const res = await memberService.updateAdditionalDetails({
        update_details: data?.updatePatientAdditionalDetails,
        user_id: userUuid,
        uuid: memberUuid,
      });
    } catch (error) {
      expect(error?.customCode).toBeNull();
    }
  });
});

test("should delete a user", async () => {
  const res = await authService.destroy(data?.patientSignup?.email);
  expect(res.message).toBe("deleted successfully");
});
