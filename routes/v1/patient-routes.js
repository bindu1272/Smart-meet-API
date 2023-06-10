const PatientController = require('../../app/http/controllers/api/v1/PatientController');
const AppointmentController = require('../../app/http/controllers/api/v1/AppointmentController');
const loggedInMiddleware = ['auth.jwt'];
const loggedIn = ['auth.user'];

module.exports = {
  [`POST patients/sign-up`]: {
    action: PatientController.signUp,
    name: 'api.signUp',
    middlewares: [],
  },

  [`POST patients/login`]: {
    action: PatientController.login,
    name: 'api.login',
    middlewares: [],
  },

  [`POST patients/gmail-login`]: {
    action: PatientController.patientGmailLogin,
    name: 'api.patientGmailLogin',
    middlewares: [],
  },

  [`POST patients/validate-sign-up`]: {
    action: PatientController.validatePatientSignUp,
    name: 'api.login',
    middlewares: [],
  },

  [`GET patients/appointments`]: {
    action: PatientController.getPatientAppointments,
    name: 'api.getPatientAppointments',
    middlewares: [...loggedInMiddleware],
  },

  [`GET patients/medical-history`]: {
    action: PatientController.getMemberMedicalHistory,
    name: 'api.getMemberMedicalHistory',
    middlewares: [...loggedInMiddleware],
  },

  [`PUT patients/appointments/:uuid/cancel-appointment`]: {
    action: AppointmentController.cancelledAppointment,
    name: 'api.cancelledAppointment',
    middlewares: [...loggedInMiddleware],
  },

  [`GET patients/members`]: {
    action: PatientController.getPatientMembers,
    name: 'api.getPatientMembers',
    middlewares: [],
  },

  [`PUT patients/users`]: {
    action: PatientController.updatePatientUser,
    name: 'api.updateMember',
    middlewares: [...loggedInMiddleware],
  },

  [`PUT patients/members/:uuid`]: {
    action: PatientController.updateMember,
    name: 'api.updateMember',
    middlewares: [...loggedInMiddleware],
  },

  [`POST patients/members`]: {
    action: PatientController.createMember,
    name: 'api.createMember',
    middlewares: [...loggedInMiddleware],
  },
  [`POST patients/additional-details`]: {
    action: PatientController.createAdditionalDetails,
    name: 'api.createAdditionalDetails',
    middlewares: [...loggedIn],
  },
  [`GET patients/additional-details/:userUuid`]: {
    action: PatientController.getAdditionalDetails,
    name: 'api.getAdditionalDetails',
    middlewares: [...loggedIn],
  },
  [`PUT patients/additional-details/:uuid`]: {
    action: PatientController.updateAdditionalDetails,
    name: 'api.updateAdditionalDetails',
    middlewares: [...loggedIn],
  },
  [`PUT patients/hospital/:uuid/mark-favourite`]: {
    action: PatientController.markHospitalFavourite,
    name: 'api.markHospitalFavourite',
    middlewares: [],
  },

  [`PUT patients/doctor/:uuid/mark-favourite`]: {
    action: PatientController.markDoctorFavourite,
    name: 'api.markDoctorFavourite',
    middlewares: [],
  },

  [`GET patients/dashboard`]: {
    action: PatientController.getPatientDashboard,
    name: 'api.getPatientDashboard',
    middlewares: [...loggedInMiddleware],
  },
  [`GET patients/dashboard/:uuid`]: {
    action: PatientController.getPatientUuidDashboard,
    name: 'api.getPatientUuidDashboard',
    middlewares: [],
  },

  [`POST patients/favourites`]: {
    action: PatientController.getFavourites,
    name: 'api.getFavourites',
    middlewares: [],
  },
};
