const StaffService = require('../../../../services/StaffService');
const DashboardService = require('../../../../services/DashboardService');
const AuthService = require('../../../../services/AuthService');
const BaseController = require('./BaseController');
const {
  UserTransformer,
  HospitalTransformer,
  PendingInvitationTransformer
} = require('../../../../transformers/Response/v1');

module.exports = {
  getDashBoardStats: async (req, res) => {
    let result = await new DashboardService(req).getDasboardStats(
      App.helpers.cloneObj(
        App.lodash.get(req, 'params'),
        App.lodash.get(req, 'query')
      )
    );

    res.success(result);
  },
  inviteStaff: async (req, res) => {
    const link = await new StaffService(req).inviteStaff(
      App.helpers.cloneObj(
        App.lodash.get(req, 'params'),
        App.lodash.get(req, 'body')
      )
    );
    res.success(link);
  },
  invitations : async (req, res) => {
    const result = await new StaffService(req).invitations();
    const transformedData = await BaseController.getTransformedData(
      req,
      result,
      PendingInvitationTransformer
    );
    res.success(transformedData);
  },

  registerStaff: async (req, res) => {
    await new StaffService(req).registerStaff(
      App.helpers.cloneObj(
        App.lodash.get(req, 'params'),
        App.lodash.get(req, 'body')
      )
    );
    res.noContent();
  },

  validateLink: async (req, res) => {
    const { registerSuccess, hospital, email } = await new StaffService(
      req
    ).validateInvitaionLink(
      App.helpers.cloneObj(
        App.lodash.get(req, 'params'),
        App.lodash.get(req, 'query')
      )
    );
    const transformedData = await BaseController.getTransformedData(
      req,
      hospital,
      HospitalTransformer
    );
    res.success({
      registerSuccess,
      hospital: transformedData,
      email,
    });
  },

  getAdmins: async (req, res) => {
    const data = await new StaffService(req).getAdmins(
      App.helpers.cloneObj(
        App.lodash.get(req, 'params'),
        App.lodash.get(req, 'query')
      )
    );
    const transformedData = await BaseController.getTransformedData(
      req,
      data,
      UserTransformer
    );
    res.success(transformedData);
  },

  getManager: async (req, res) => {
    const data = await new StaffService(req).getManager(
      App.helpers.cloneObj(
        App.lodash.get(req, 'params'),
        App.lodash.get(req, 'query')
      )
    );
    const transformedData = await BaseController.getTransformedData(
      req,
      data,
      UserTransformer
    );
    res.success(transformedData);
  },

  getDelegates: async (req, res) => {
    const data = await new StaffService(req).getDelegates(
      App.helpers.cloneObj(
        App.lodash.get(req, 'params'),
        App.lodash.get(req, 'query')
      )
    );
    const transformedData = await BaseController.getTransformedData(
      req,
      data,
      UserTransformer
    );
    res.success(transformedData);
  },

  removeDelegate: async (req, res) => {
    await new StaffService(req).removeDelegate(
      App.helpers.cloneObj(
        App.lodash.get(req, 'params'),
        App.lodash.get(req, 'body')
      )
    );
    res.noContent();
  },

  staffForgotPassword: async (req, res) => {
    await new AuthService().staffForgotPassword(
      App.helpers.cloneObj(
        App.lodash.get(req, 'params'),
        App.lodash.get(req, 'body')
      )
    );
    res.noContent();
  },

  validateForgotPassword: async (req, res) => {
    await new AuthService().validateForgotPasswordLink(
      App.helpers.cloneObj(
        App.lodash.get(req, 'params'),
        App.lodash.get(req, 'body')
      )
    );
    res.noContent();
  },
  changePassword: async (req, res) => {
    await new AuthService().changeForgotPassword(
      App.helpers.cloneObj(
        App.lodash.get(req, 'params'),
        App.lodash.get(req, 'body')
      )
    );
    res.noContent();
  },
  deleteHospitalAdmin : async(req,res)=>{
    await new StaffService(req).deleteHospitalAdmin(
      App.helpers.cloneObj(
        App.lodash.get(req, "params"),
        App.lodash.get(req, "body")
      )
    );
    res.success("deleted record successfully");
  }
};
