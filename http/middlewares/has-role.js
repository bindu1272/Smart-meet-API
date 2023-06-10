const { get } = require('../../../app');
const ForbiddenError = require('../../errors/ForbiddenError');
const UnauthorizedError = require('../../errors/UnauthorizedError');

module.exports = (roles) => {
  return (req, res, next) => {
    let rolesArr = roles.split(',');

    if (!req.auth.isLoggedIn) {
      throw new UnauthorizedError();
    }

    let settingsRoles = App.helpers.config('settings.roles');

    let roleIDs = App.lodash.map(rolesArr, (r) => {
      return App.lodash.get(
        App.lodash.find(settingsRoles, ['name', r]),
        'value'
      );
    });

    let userRoleIds = App.helpers.getObjProp(req, 'auth.user.roles');
    let allowed = false;

    App.lodash.map(roleIDs, (r) => {
      if (App.lodash.includes(userRoleIds, r)) {
        allowed = true;
      }
    });

    if (!allowed) {
      throw new ForbiddenError();
    }

    next();
  };
};
