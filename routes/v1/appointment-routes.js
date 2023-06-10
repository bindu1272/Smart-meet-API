const AppointmentController = require('../../app/http/controllers/api/v1/AppointmentController');
const RatingController = require('../../app/http/controllers/api/v1/RatingController');
const CommonMiddleware = ['auth.jwt', 'hasRole:Admin,Doctor,Manager,Delegate'];
const DoctorMiddleware = ['auth.jwt', 'hasRole:Doctor'];
const DoctorDelegateMiddleware = ['auth.jwt', 'hasRole:Doctor,Delegate'];
const LoggedInMiddleware = ['auth.jwt'];
const AppointmentMiddleware = [
  'auth.jwt',
  'hasRole:Admin,Doctor,Manager,Delegate',
];

module.exports = {
  [`POST appointments`]: {
    action: AppointmentController.createAppointment,
    name: 'api.createAppointment',
    middlewares: [],
  },
  [`POST appointments/emergency`]: {
    action: AppointmentController.createEmergencyAppointment,
    name: 'api.createEmergencyAppointment',
    middlewares: [],
  },

  [`POST appointments/validate`]: {
    action: AppointmentController.validateAppointment,
    name: 'api.validateAppointment',
    middlewares: [],
  },
  [`GET appointments`]: {
    action: AppointmentController.getAppointments,
    name: 'api.getAppointments',
    middlewares: [...AppointmentMiddleware],
  },
  [`PUT appointments/:uuid`]: {
    action: AppointmentController.updateAppointment,
    name: 'api.updateAppointment',
    middlewares: [...AppointmentMiddleware],
  },

  [`PUT appointments/:uuid/reschedule`]: {
    action: AppointmentController.rescheduleAppointment,
    name: 'api.rescheduleAppointment',
    middlewares: [...LoggedInMiddleware],
  },

  [`POST appointments/:appointment_uuid/appointment-note`]: {
    action: AppointmentController.addAppointmentNote,
    name: 'api.addAppointmentNote',
    middlewares: [...DoctorDelegateMiddleware],
  },

  [`PUT appointments/:appointment_uuid/appointment-note/:uuid`]: {
    action: AppointmentController.updateAppointmentNote,
    name: 'api.addAppointmentNote',
    middlewares: [...DoctorDelegateMiddleware],
  },

  [`GET patients/:uuid/medical-history`]: {
    action: AppointmentController.getMedicalHistory,
    name: 'api.getMedicalHistory',
    middlewares: [...CommonMiddleware],
  },

  [`GET patients/:uuid/medical-history/:note_uuid/print`]: {
    action: AppointmentController.printMedicalHistory,
    name: 'api.printMedicalHistory',
    middlewares: [],
  },

  [`POST appointments/:uuid/ratings`]: {
    action: RatingController.createRating,
    name: 'api.createRating',
    middlewares: [],
  },
};
