const AuthService = require("../../services/AuthService");
const data = require("../api/data.json");
require("../../providers/CustomValidatorServiceProvider");

const authService = new AuthService();
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
    expect(error?.errors?.email?.[0]).toBe("The email has already been taken.");
  }
});

test("should create a user as patient while resend Otp", async () => {
  try {
    // code that might throw an exception
    const res = await authService.resendOtp({ uuid: userUuid });
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
    expect(error?.customCode).toBeNull();
    expect(error?.errors?.uuid?.[0]).toBe("The uuid field is required.");
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

test("should validate a user as patient Invalid Case", async () => {
  try {
    // code that might throw an exception
    const res = await authService.validatePatientSignUp({
      otp_uuid: userUuid,
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

test("should delete a user", async () => {
  const res = await authService.destroy(data?.patientSignup?.email);
  expect(res.message).toBe("deleted successfully");
});
