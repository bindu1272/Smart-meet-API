const SpecialisationController = require('../../app/http/controllers/api/v1/SpecialisationController');
const Middleware = ['auth.jwt'];
module.exports = {
  [`GET specialisations`]: {
    action: SpecialisationController.index,
    name: 'api.login',
    middlewares: [],
  },
};
