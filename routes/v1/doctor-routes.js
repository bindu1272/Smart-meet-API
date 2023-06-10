const DoctorController = require('../../app/http/controllers/api/v1/DoctorController');
const RatingController = require('../../app/http/controllers/api/v1/RatingController');

const AppointmentController = require('../../app/http/controllers/api/v1/AppointmentController');
const { Appointment } = require('../../app/models');
const Middleware = ['auth.jwt'];
const DoctorMiddleware = ['auth.jwt', 'hasRole:Doctor'];
const DoctorDelegateMiddleware = ['auth.jwt', 'hasRole:Doctor,Delegate'];
const DoctorAdminMiddleware = ['auth.jwt', 'hasRole:Admin,Doctor'];
const AdminMiddleware = ['auth.jwt', 'hasRole:Admin,Delegate'];

module.exports = {
  [`POST doctors/invite`]: {
    action: DoctorController.inviteDoctor,
    name: 'api.inviteDoctor',
    middlewares: [...Middleware],
  },
  [`GET doctor/invitations`]: {
    action: DoctorController.invitations,
    name: 'api.invitations',
    middlewares: [...Middleware],
  },
  [`GET doctors/validate-link/:uuid`]: {
    action: DoctorController.validateLink,
    name: 'api.validateLink',
    middlewares: [],
  },

  [`GET doctors/:uuid/faqs`]: {
    action: DoctorController.getDoctorFaqs,
    name: 'api.getDoctorFaqs',
    middlewares: [],
  },

  [`POST doctors/faqs`]: {
    action: DoctorController.createDoctorFaqs,
    name: 'api.createDoctorFaqs',
    middlewares: [...DoctorMiddleware],
  },
  ///hospitals/:hospital_uuid/faqs
  [`POST /hospitals/faqs`]: {
    action: DoctorController.getDoctorFaqs,
    name: 'api.getDoctorFaqs',
    middlewares: [...DoctorMiddleware],
  },

  [`GET doctors/:uuid/reviews`]: {
    action: RatingController.getDoctorReview,
    name: 'api.getDoctorReview',
    middlewares: [],
  },

  [`POST doctors`]: {
    action: DoctorController.registerDoctor,
    name: 'api.registerDoctor',
    middlewares: [],
  },

  [`PUT doctors`]: {
    action: DoctorController.updateDoctor,
    name: 'api.updateDoctor',
    middlewares: [...DoctorMiddleware],
  },

  [`PUT doctors/:uuid/working-hours`]: {
    action: DoctorController.updateWorkingHours,
    name: 'api.updateWorkingHours',
    middlewares: [...DoctorDelegateMiddleware],
  },

  [`GET doctors/:uuid/working-hours`]: {
    action: DoctorController.getWorkingHours,
    name: 'api.getWorkingHours',
    middlewares: [...DoctorDelegateMiddleware],
  },

  [`GET hospitals/:hospital_uuid/doctors/:uuid/working-hours`]: {
    action: DoctorController.getHospitalDoctorWorkingHours,
    name: 'api.getHospitalDoctorWorkingHours',
    middlewares: [],
  },

  [`PUT doctors/:uuid`]: {
    action: DoctorController.adminUpdateDoctor,
    name: 'api.adminUpdateDoctor',
    middlewares: [...DoctorAdminMiddleware],
  },

  [`GET doctors`]: {
    action: DoctorController.getDoctors,
    name: 'api.getDoctors',
    middlewares: [...AdminMiddleware],
  },

  [`GET doctors/:uuid`]: {
    action: DoctorController.getSingleDoctor,
    name: 'api.getSingleDoctor',
    middlewares: [],
  },

  [`GET doctors/:uuid/hospitals/:hospital_uuid/line-up`]: {
    action: AppointmentController.getDoctorLineUp,
    name: 'api.getDoctorLineUp',
    middlewares: [],
  },

  [`GET doctors/:uuid/appointment-slots/:hospital_uuid`]: {
    action: AppointmentController.getDoctorsAppointments,
    name: 'api.getDoctorsAppointments',
    middlewares: [],
  },

  [`GET doctors/:uuid/monthly-availability/:hospital_uuid`]: {
    action: AppointmentController.getDoctorMonthlyAvaialbility,
    name: 'api.getDoctorsAppointments',
    middlewares: [...DoctorDelegateMiddleware],
  },

  [`POST doctors/invite`]: {
    action: DoctorController.inviteDoctor,
    name: 'api.inviteDoctor',
    middlewares: [...Middleware],
  },

  [`POST doctors/:doctor_uuid/doctors-leaves`]: {
    action: DoctorController.createLeave,
    name: 'api.createLeave',
    middlewares: [...DoctorDelegateMiddleware],
  },

  [`PUT doctors/:doctor_uuid/doctors-leaves/:uuid`]: {
    action: DoctorController.udpateLeave,
    name: 'api.udpateLeave',
    middlewares: [...DoctorDelegateMiddleware],
  },

  [`DELETE doctors/:doctor_uuid/doctors-leaves/:uuid`]: {
    action: DoctorController.deleteLeave,
    name: 'api.udpateLeave',
    middlewares: [...DoctorDelegateMiddleware],
  },

  [`GET doctors/:doctor_uuid/doctors-leaves`]: {
    action: DoctorController.getLeaves,
    name: 'api.getLeaves',
    middlewares: [...DoctorDelegateMiddleware],
  },
  [`DELETE doctors/:uuid`]: {
    action: DoctorController.deleteDoctor,
    name: 'api.deleteDoctor',
    middlewares: [...AdminMiddleware],
},
[`GET alldoctors`]: {
  action: DoctorController.getAllDoctors,
  name: 'api.getDoctors',
  middlewares: [],
},
[`GET doctors/:uuid/questions`]: {
  action: DoctorController.getDoctorQuestions,
  name: 'api.DoctorController.getDoctorQuestions',
  middlewares: [],
},
[`GET doctors/:uuid/doctor-includedquestions`]: {
  action: DoctorController.getDoctorandIncludedQuestions,
  name: 'api.DoctorController.getDoctorandIncludedQuestions',
  middlewares: [],
},
[`POST doctor/question`]: {
  action: DoctorController.createDoctorQuestion,
  name: 'api.DoctorController.createDoctorQuestion',
  middlewares: [...DoctorAdminMiddleware],
},
[`POST doctor/included-questions`]: {
  action: DoctorController.includeDoctorQuestions,
  name: 'api.DoctorController.includeDoctorQuestions',
  middlewares: [...DoctorAdminMiddleware],
},
[`GET doctor/:doctor_uuid/included-questions`]: {
  action: DoctorController.getDoctorIncludedQuestions,
  name: 'api.DoctorController.getDoctorIncludedQuestions',
  middlewares: [],
},
[`GET doctor/:doctor_uuid/not-included-questions`]: {
  action: DoctorController.getDoctorNotIncludedQuestions,
  name: 'api.DoctorController.getDoctorNotIncludedQuestions',
  middlewares: [],
},
[`DELETE doctor/question/:uuid`]: {
  action: DoctorController.deleteQuestion,
  name: 'api.deleteQuestion',
  middlewares: [...DoctorAdminMiddleware],
},
[`PUT doctor/:uuid/question`]: {
action: DoctorController.updateQuestion,
name: 'api.DoctorController.updateQuestion',
middlewares: [...DoctorAdminMiddleware],
},
};
