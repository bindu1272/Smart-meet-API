const DepartmentController = require('../../app/http/controllers/api/v1/DepartmentController');

const AdminMiddleware = ['auth.jwt', 'hasRole:Admin'];

module.exports = {
  [`POST departments`]: {
    action: DepartmentController.create,
    name: 'api.create',
    middlewares: [...AdminMiddleware],
  },

  [`PUT departments/doctors`]: {
    action: DepartmentController.assignDepartmentToDoctor,
    name: 'api.udpate',
    middlewares: [...AdminMiddleware],
  },

  [`PUT departments/:uuid`]: {
    action: DepartmentController.udpate,
    name: 'api.udpate',
    middlewares: [...AdminMiddleware],
  },

  [`GET departments`]: {
    action: DepartmentController.index,
    name: 'api.index',
    middlewares: [...AdminMiddleware],
  },
  [`DELETE departments/:uuid`]: {
    action: DepartmentController.deleteDepartment,
    name: 'api.deleteDepartment',
    middlewares: [...AdminMiddleware],
},
};
