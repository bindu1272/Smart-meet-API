const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../../errors/UnauthorizedError');
const { Customer } = require('../../models');

module.exports = function (req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  console.log('{ user }', req.user);
  // if (!token) {
  //   throw new UnauthorizedError();
  // }

  // jwt.verify(token, App.env.JWT_SECRET, (err, jwtPayload) => {
  //   if (err) {
  //     throw new UnauthorizedError();
  //   }

  //   Customer.findOne({ where: { id: App.lodash.get(jwtPayload, 'id') } })
  //     .then((customer) => {
  //       if (customer) {
  //         req.customer = customer;
  //         next();
  //       } else {
  //         throw new UnauthorizedError();
  //       }
  //     })
  //     .catch((err) => {
  //       throw new UnauthorizedError();
  //     });
  // });
};
