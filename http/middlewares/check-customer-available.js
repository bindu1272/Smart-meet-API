const ForbiddenError = require("../../errors/ForbiddenError");
const { VendorRepository, UserRepository } = require("../../repositories");

module.exports = () => {
  return async (req, res, next) => {
    const authUser = App.helpers.getObjProp(req, "auth.user");
    

    
  };
};
