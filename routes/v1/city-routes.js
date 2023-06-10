const CityController = require('../../app/http/controllers/api/v1/CityController');

const SuperAdminMiddleware = ['auth.jwt', 'hasRole:SuperAdmin'];

module.exports = {
  [`POST cities`]: {
    action: CityController.create,
    name: 'api.create',
    middlewares: [...SuperAdminMiddleware],
  },

  [`PUT cities/:uuid`]: {
    action: CityController.update,
    name: 'api.put',
    middlewares: [...SuperAdminMiddleware],
  },

  [`GET cities`]: {
    action: CityController.listCities,
    name: 'api.get',
    middlewares: [],
  },
  [`DELETE cities/:uuid`]: {
    action: CityController.deleteCity,
    name: 'api.deleteCity',
    middlewares: [...SuperAdminMiddleware],
},
};
