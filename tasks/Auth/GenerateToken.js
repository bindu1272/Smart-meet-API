const jwt = require('jsonwebtoken');

module.exports = async (user, roles, hospital, isStaff) => {
  const access_token = await jwt.sign(
    {
      id: user?.getData('id'),
      roles,
      hospital: App.lodash.get(hospital, 'id'),
      isStaff,
    },
    App.env.JWT_SECRET,
    {
      expiresIn: App.env.JWT_TOKEN_EXPIRY,
    }
  );
  return {
    access_token,
    token_type: 'bearer',
  };
};
