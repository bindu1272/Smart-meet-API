const HospitalController = require('../../app/http/controllers/api/v1/HospitalController');
const RatingController = require('../../app/http/controllers/api/v1/RatingController');
const DoctorController = require('../../app/http/controllers/api/v1/DoctorController');
const superAdminMiddleware = ['auth.jwt', 'hasRole:SuperAdmin'];
const adminMiddleware = ['auth.jwt', 'hasRole:Admin'];
const hospitalRoute = `hospitals`;

module.exports = {
  [`GET ${hospitalRoute}/validate/:email`]: {
    action: HospitalController.validateHospitalRegistrationEmail,
    name: 'api.UserController.validateHospitalRegistrationEmail',
    middlewares: [],
  },

  [`POST ${hospitalRoute}/validate`]: {
    action: HospitalController.validateHospital,
    name: 'api.UserController.validateHospital',
    middlewares: [],
  },

  [`POST ${hospitalRoute}`]: {
    action: HospitalController.registerHospital,
    name: 'api.UserController.registerHospital',
    middlewares: [],
  },

  [`POST ${hospitalRoute}/faqs`]: {
    action: HospitalController.createHospitalFaqs,
    name: 'api.HospitalController.createHospitalFaqs',
    middlewares: [...adminMiddleware],
  },
  [`POST ${hospitalRoute}/ads`]: {
    action: HospitalController.createHospitalAds,
    name: 'api.HospitalController.createHospitalAds',
    middlewares: [...adminMiddleware],
  },
  [`DELETE ${hospitalRoute}/ads/:uuid`]: {
    action: HospitalController.deleteAds,
    name: 'api.deleteAds',
    middlewares: [...adminMiddleware],
},
[`PUT ${hospitalRoute}/:uuid/ads`]: {
  action: HospitalController.updateAds,
  name: 'api.HospitalController.updateAds',
  middlewares: [...adminMiddleware],
},
[`POST ${hospitalRoute}/notifications`]: {
  action: HospitalController.createHospitalNotifications,
  name: 'api.HospitalController.createHospitalNotifications',
  middlewares: [...adminMiddleware],
},
[`DELETE ${hospitalRoute}/notifications/:uuid`]: {
  action: HospitalController.deleteNotifications,
  name: 'api.deleteNotifications',
  middlewares: [...adminMiddleware],
},
[`PUT ${hospitalRoute}/:uuid/notifications`]: {
action: HospitalController.updateNotifications,
name: 'api.HospitalController.updateNotifications',
middlewares: [...adminMiddleware],
},
[`POST ${hospitalRoute}/question`]: {
  action: HospitalController.createHospitalQuestion,
  name: 'api.HospitalController.createHospitalQuestion',
  middlewares: [...adminMiddleware],
},
[`DELETE ${hospitalRoute}/question/:uuid`]: {
  action: HospitalController.deleteQuestion,
  name: 'api.deleteQuestion',
  middlewares: [...adminMiddleware],
},
[`PUT ${hospitalRoute}/:uuid/question`]: {
action: HospitalController.updateQuestion,
name: 'api.HospitalController.updateQuestion',
middlewares: [...adminMiddleware],
},
  [`GET ${hospitalRoute}`]: {
    action: HospitalController.getHosptalList,
    name: 'api.UserController.registerHospital',
    middlewares: [...superAdminMiddleware],
  },

  [`GET ${hospitalRoute}/:uuid/faqs`]: {
    action: HospitalController.getHospitalFaqs,
    name: 'api.HospitalController.getHospitalFaqs',
    middlewares: [],
  },
  [`GET ${hospitalRoute}/:uuid/ads`]: {
    action: HospitalController.getHospitalAds,
    name: 'api.HospitalController.getHospitalAds',
    middlewares: [],
  },
  [`GET ${hospitalRoute}/ads/:uuid`]: {
    action: HospitalController.getHospitalAd,
    name: 'api.HospitalController.getHospitalAd',
    middlewares: [],
  },
  [`GET ${hospitalRoute}/:uuid/notifications`]: {
    action: HospitalController.getHospitalNotifications,
    name: 'api.HospitalController.getHospitalNotifications',
    middlewares: [],
  },
  [`GET ${hospitalRoute}/notifications/:uuid`]: {
    action: HospitalController.getHospitalNotification,
    name: 'api.HospitalController.getHospitalNotification',
    middlewares: [],
  },
  [`GET ${hospitalRoute}/:uuid/questions`]: {
    action: HospitalController.getHospitalQuestions,
    name: 'api.HospitalController.getHospitalQuestions',
    middlewares: [],
  },
  [`GET ${hospitalRoute}/:uuid/reviews`]: {
    action: RatingController.getHospitalReview,
    name: 'api.UserController.getHospitalReview',
    middlewares: [],
  },

  [`GET ${hospitalRoute}/:uuid/doctors`]: {
    action: DoctorController.getHospitalDoctors,
    name: 'api.DoctorController.getHospitalDoctors',
    middlewares: [],
  },

  [`GET ${hospitalRoute}/:uuid`]: {
    action: HospitalController.getSingleHosptalList,
    name: 'api.HospitalController.getSingleHosptalList',
    middlewares: [],
  },

  [`PUT ${hospitalRoute}/:uuid`]: {
    action: HospitalController.updateHospital,
    name: 'api.UserController.updateHospital',
    middlewares: [...adminMiddleware],
  },

  [`PUT ${hospitalRoute}/:uuid/status`]: {
    action: HospitalController.updateHospitalStatus,
    name: 'api.UserController.updateHospitalStatus',
    middlewares: [...superAdminMiddleware],
  },

  [`PUT ${hospitalRoute}/:uuid/billing-types`]: {
    action: HospitalController.updateHospitalBillingType,
    name: 'api.UserController.updateHospitalBillingType',
    middlewares: [...superAdminMiddleware],
  },
  [`GET ${hospitalRoute}`]: {
    action: HospitalController.getHospitals,
    name: 'api.getHospitals',
    middlewares: [],
  },
  [`GET hospital/:userId/doctor`]: {
    action: HospitalController.getDoctorsHospital,
    name: 'api.getDoctorsHospital',
    middlewares: [],
  }
};
