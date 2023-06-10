const ForbiddenError = require("../../errors/ForbiddenError");
const { VendorRepository, UserRepository } = require("../../repositories");

module.exports = () => {
  return async (req, res, next) => {
    const authUser = App.helpers.getObjProp(req, "auth.user");
    const userRole = authUser.getData("role_id");

    let inputs = App.helpers.cloneObj(req.body, req.params);
    inputs = App.helpers.cloneObj(inputs, req.query);

    if ("branch_uuid" in inputs) {
      if (userRole === App.helpers.config("settings.roles.admin.value")) {
        let vendor = await new VendorRepository().vendorBranchs(
          App.lodash.get(authUser, "vendor_id")
        );
        let branch = App.lodash.find(
          App.lodash.get(vendor, "vendor_branches", []),
          ["uuid", App.lodash.get(inputs, "branch_uuid")]
        );

        if (!branch) {
          throw new ForbiddenError();
        }
        req["branch"] = branch;
        next();
      } else {
        let branch = App.lodash.find(
          await new UserRepository().getUserBranches(authUser),
          ["uuid", App.lodash.get(inputs, "branch_uuid")]
        );

        if (!branch) {
          throw new ForbiddenError();
        }
        req["branch"] = branch;
        next();
      }
    } else {
      throw new ForbiddenError();
    }
  };
};
