const passport = require('passport');
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const { User } = require('../../models');

let jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: App.env.JWT_SECRET,
};

var strategy = new JWTStrategy(jwtOptions, async (jwtPayload, next) => {
  User.findOne({ where: { id: jwtPayload.id } })
    .then((user) => {
      if (user) {
        return next(null, {
          detail: user,
          ...jwtPayload,
        });
      } else {
        return next(null, false);
      }
    })
    .catch((err) => {
      return next(err);
    });
});

passport.use(strategy);

module.exports = passport;
