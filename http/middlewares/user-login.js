const passport = require('passport');

module.exports = function (app) {
  app.use((req, res, next) => {
    passport.authenticate(
      'jwt',
      { session: false },
      function (err, user, info) {
        if (err) {
          return next(err);
        }

        req['api'] = {
          version: req.url.split('/')[2] ? req.url.split('/')[2] : 'v2',
        };

        req['auth'] = {
          isLoggedIn: user ? true : false,
          user: user ? user : null,
        };

        return next();
      }
    )(req, res, next);
  });
};
