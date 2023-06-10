const request = require("supertest");
const app = require("../../../app");
const data = require("./data.json");
let userUuid = "";


test("POST /api/v1/patients/sign-up should create a user as patient", async () => {
//   const res = await request(app).post("/api/v1/patients/sign-up").send(data.patientSignup);
//   userUuid = res.body.data.id;
//   expect(res.body.code).toBe(200);
//   expect(res.body.data.id).not.toBeNull();
//   expect(res.body.data.owner).not.toBeNull();
//   expect(res.body.data.owner).toBe(data.patientSignup.email);
});
