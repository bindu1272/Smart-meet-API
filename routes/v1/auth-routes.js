const AuthController = require('../../app/http/controllers/api/v1/AuthController');
const HospitalController = require('../../app/http/controllers/api/v1/HospitalController');
const Middleware = ['auth.jwt'];
module.exports = {
  [`POST staff/login`]: {
    action: AuthController.staffLogin,
    name: 'api.login',
    middlewares: [],
  },

  [`POST staff/switch-hospital`]: {
    action: AuthController.switchHospital,
    name: 'api.switchHospital',
    middlewares: [],
  },

  [`POST resend-otp`]: {
    action: AuthController.resendOtp,
    name: 'api.resendOtp',
    middlewares: [],
  },

  [`PUT users`]: {
    action: AuthController.updateUser,
    name: 'api.updateUser',
    middlewares: [...Middleware],
  },

  [`GET test`]: {
    action: HospitalController.getHospitalDoctor,
    name: 'api.test',
    middlewares: [],
  },

  [`GET test2`]: {
    action: AuthController.getPdf,
    name: 'api.test',
    middlewares: [],
  },

  [`DELETE users/:email`]: {
    action: AuthController.destroy,
    name: "api.deleteUser",
    middlewares: [],
  },
};
