const StaffController = require('../../app/http/controllers/api/v1/StaffController');
const LoggedInMiddleware = [
  'auth.jwt',
  'hasRole:SuperAdmin,Admin,Doctor,Manager,Delegate',
];
const DoctorAdminMiddleware = ['auth.jwt', 'hasRole:Admin,Doctor'];
const AdminMiddleware = ['auth.jwt', 'hasRole:Admin'];
const DoctorMiddleware = ['auth.jwt', 'hasRole:Doctor'];
module.exports = {
  [`POST staffs/invite`]: {
    action: StaffController.inviteStaff,
    name: 'api.inviteStaff',
    middlewares: [...DoctorAdminMiddleware],
  },
  [`GET staffs/invitations`]: {
    action: StaffController.invitations,
    name: 'api.invitations',
    middlewares: [...DoctorAdminMiddleware],
  },
  [`POST staffs`]: {
    action: StaffController.registerStaff,
    name: 'api.registerStaff',
    middlewares: [],
  },

  [`GET staffs/validate-link/:uuid`]: {
    action: StaffController.validateLink,
    name: 'api.inviteStaff',
    middlewares: [],
  },

  [`GET staffs`]: {
    action: StaffController.validateLink,
    name: 'api.inviteStaff',
    middlewares: [],
  },

  [`GET staffs/dashboard`]: {
    action: StaffController.getDashBoardStats,
    name: 'api.getDashBoardStats',
    middlewares: [...LoggedInMiddleware],
  },

  [`GET staffs/admins`]: {
    action: StaffController.getAdmins,
    name: 'api.inviteStaff',
    middlewares: [...AdminMiddleware],
  },
  [`DELETE staffs/admins/:uuid`]: {
    action: StaffController.deleteHospitalAdmin,
    name: 'api.deleteHospitalAdmin',
    middlewares: [...AdminMiddleware],
},

  [`GET staffs/managers`]: {
    action: StaffController.getManager,
    name: 'api.inviteStaff',
    middlewares: [...AdminMiddleware],
  },

  [`GET staffs/delegates`]: {
    action: StaffController.getDelegates,
    name: 'api.getDelegates',
    middlewares: [...DoctorMiddleware],
  },

  [`DELETE staffs/delegates/:uuid`]: {
    action: StaffController.removeDelegate,
    name: 'api.removeDelegate',
    middlewares: [...DoctorMiddleware],
  },

  [`POST forgot-password`]: {
    action: StaffController.staffForgotPassword,
    name: 'api.staffForgotPassword',
    middlewares: [],
  },
  [`GET validate-forgot-password/:uuid`]: {
    action: StaffController.validateForgotPassword,
    name: 'api.validateForgotPassword',
    middlewares: [],
  },

  [`POST change-password`]: {
    action: StaffController.changePassword,
    name: 'api.changePassword',
    middlewares: [],
  },
};
