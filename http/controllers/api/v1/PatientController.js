const AuthService = require('../../../../services/AuthService');
const AppointmentService = require('../../../../services/AppointmentService');
const MemberService = require('../../../../services/MemberService');
const AppointmentNoteService = require('../../../../services/AppointmentNoteService');
const {
  UserTransformer,
  OtpTransformer,
  AppointmentTransformer,
  AppointmentNoteTransformer,
  MemberTransformer,
  AdditionalDetailsTransformer
} = require('../../../../transformers/Response/v1');
const BaseController = require('./BaseController');
const GenerateToken = require('../../../../tasks/Auth/GenerateToken');

module.exports = {
  login: async (req, res) => {
    let { user } = await new AuthService(req).patientLogin(
      App.helpers.cloneObj(
        App.lodash.get(req, 'params'),
        App.lodash.get(req, 'body')
      )
    );

    const transformeUser = await BaseController.getTransformedData(
      req,
      user,
      UserTransformer
    );
    const tokenObj = await GenerateToken(
      user,
      [App.helpers.config('settings.roles.patient.value')],
      [],
      false
    );
    return res.success({
      ...tokenObj,
      user: transformeUser,
    });
  },

  patientGmailLogin: async (req, res) => {
    let { user } = await new AuthService(req).patientGmailLogin(
      App.helpers.cloneObj(
        App.lodash.get(req, 'params'),
        App.lodash.get(req, 'body')
      )
    );

    const transformeUser = await BaseController.getTransformedData(
      req,
      user,
      UserTransformer
    );
    const tokenObj = await GenerateToken(
      user,
      [App.helpers.config('settings.roles.patient.value')],
      [],
      false
    );
    return res.success({
      ...tokenObj,
      user: transformeUser,
    });
  },

  signUp: async (req, res) => {
    let otp = await new AuthService(req).patientSignUp(
      App.helpers.cloneObj(
        App.lodash.get(req, 'params'),
        App.lodash.get(req, 'body')
      )
    );
    const transformeData = await BaseController.getTransformedData(
      req,
      otp,
      OtpTransformer
    );
    res.success(transformeData);
  },

  validatePatientSignUp: async (req, res) => {
    let { user } = await new AuthService(req).validatePatientSignUp(
      App.helpers.cloneObj(
        App.lodash.get(req, 'params'),
        App.lodash.get(req, 'body')
      )
    );
    const transformeUser = await BaseController.getTransformedData(
      req,
      user,
      UserTransformer
    );
    const tokenObj = await GenerateToken(
      user,
      [App.helpers.config('settings.roles.patient.value')],
      [],
      false
    );
    return res.success({
      ...tokenObj,
      user: transformeUser,
    });
  },

  getPatientAppointments: async (req, res) => {
    let result = await new AppointmentService(req).getPatientAppointments(
      App.helpers.cloneObj(
        App.lodash.get(req, 'params'),
        App.lodash.get(req, 'query')
      )
    );
    const transformeData =
      await BaseController.getTransformedDataWithPagination(
        req,
        result,
        AppointmentTransformer
      );
    res.success(transformeData);
  },

  getPatientMembers: async (req, res) => {
    let members = await new MemberService(req).getPatientMembers();
    const transformeData = await BaseController.getTransformedData(
      req,
      members,
      MemberTransformer
    );
    res.success(transformeData);
  },

  getPatientDashboard: async (req, res) => {
    let { user, members, stats } = await new MemberService(
      req
    ).getPatientDashboard();
    const transformUserData = await BaseController.getTransformedData(
      req,
      user,
      UserTransformer
    );
    const transformMemberData = await BaseController.getTransformedData(
      req,
      members,
      MemberTransformer
    );
    res.success({
      user: transformUserData,
      members: transformMemberData,
      stats,
    });
  },
  getPatientUuidDashboard: async (req, res) => {
    let { user, members, stats } = await new MemberService(
      req
    ).getPatientUuidDashboard(
       App.helpers.cloneObj(
          App.lodash.get(req, 'params'),
          App.lodash.get(req, 'body')
        )
    );
    const transformUserData = await BaseController.getTransformedData(
      req,
      user,
      UserTransformer
    );
    const transformMemberData = await BaseController.getTransformedData(
      req,
      members,
      MemberTransformer
    );
    res.success({
      user: transformUserData,
      members: transformMemberData,
      stats,
    });
  },

  updatePatientUser: async (req, res) => {
    await new MemberService(req).updatePatientUser(
      App.helpers.cloneObj(
        App.lodash.get(req, 'params'),
        App.lodash.get(req, 'body')
      )
    );
    res.success("success");
  },

  createMember: async (req, res) => {
    await new MemberService(req).createMember(
      App.helpers.cloneObj(
        App.lodash.get(req, 'params'),
        App.lodash.get(req, 'body')
      )
    );
    res.noContent();
  },
  createAdditionalDetails: async (req, res) => {
    await new MemberService(req).createAdditionalDetails(
      App.helpers.cloneObj(
        App.lodash.get(req, 'params'),
        App.lodash.get(req, 'body')
      )
    );
    res.noContent();
  },
  getAdditionalDetails: async (req, res) => {
    let additionalDetails = await new MemberService(req).getAdditionalDetails(
      App.lodash.get(req, 'params')
    );
    let transformedData = await BaseController.getTransformedData(
      req,
      additionalDetails,
      AdditionalDetailsTransformer,
    );
    res.success(transformedData);
  },
  updateAdditionalDetails: async (req, res) => {
    await new MemberService(req).updateAdditionalDetails(
      App.helpers.cloneObj(
        App.lodash.get(req, 'params'),
        App.lodash.get(req, 'body')
      )
    );
    res.noContent();
  },
  updateMember: async (req, res) => {
    await new MemberService(req).updateMember(
      App.helpers.cloneObj(
        App.lodash.get(req, 'params'),
        App.lodash.get(req, 'body')
      )
    );
    res.noContent();
  },

  getMemberMedicalHistory: async (req, res) => {
    let result = await new AppointmentNoteService(req).getMemberMedicalHistory(
      App.helpers.cloneObj(
        App.lodash.get(req, 'params'),
        App.lodash.get(req, 'query')
      )
    );

    const transformedData =
      await BaseController.getTransformedDataWithPagination(
        req,
        result,
        AppointmentNoteTransformer
      );
    res.success(transformedData);
  },

  markHospitalFavourite: async (req, res) => {
    await new MemberService().markHospitalFavourite(
      // req.user,
      App.helpers.cloneObj(req.params, req.body)
    );
    res.noContent();
  },

  markDoctorFavourite: async (req, res) => {
    await new MemberService().markDoctorFavourite(
      App.helpers.cloneObj(req.params, req.body)
    );
    res.noContent();
  },

  getFavourites: async (req, res) => {
    const { Doctors, hospitals } = await new MemberService(req).getFavourites(
      App.helpers.cloneObj(req.params, req.body)
    );
    res.success({ Doctors, hospitals });
  },
};
