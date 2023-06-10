const ejs = require('ejs');
const path = require('path');

const pdf = require('html-pdf');
const BaseController = require('./BaseController');
const AuthService = require('../../../../services/AuthService');
const InvoiceServices = require('../../../../services/InvoiceServices');
const {
  UserTransformer,
  HospitalTransformer,
} = require('../../../../transformers/Response/v1');
const GenerateToken = require('../../../../tasks/Auth/GenerateToken');
const GetHospitalRole = require('../../../../tasks/Auth/GetHospitalRole');

module.exports = {
  test: async (req, res) => {
    await new AuthService().test();
    res.noContent();
  },

  resendOtp: async (req, res) => {
    const otp = await new AuthService().resendOtp(
      App.helpers.cloneObj(req.body, req.params)
    );
    res.success(otp);
  },

  getPdf: async (req, res) => {
    const template = path.resolve(App.paths.views, 'invoice.ejs');
    const invoice = await new InvoiceServices().mailInvoicetoAdmin();

    ejs.renderFile(
      template,
      {
        data: JSON.parse(JSON.stringify(App.lodash.get(invoice, 'dataValues'))),
      },
      {},
      (err, str) => {
        pdf.create(str).toStream(function (err, stream) {
          console.log('@@@@', {
            err,
            stream,
          });
          stream.pipe(res);
        });
      }
    );
  },

  staffLogin: async (req, res) => {
    let { user, hospitals, isSuperAdmin } = await new AuthService(
      req
    ).staffLogin(req.body);

    if (!isSuperAdmin) {
      const { roles, userCurrentHospital, userHospitals } = GetHospitalRole(
        hospitals[0],
        hospitals
      );
      const transformeUser = await BaseController.getTransformedData(
        req,
        user,
        UserTransformer,
        {
          roles,
        }
      );
      const transformedCurrentHospital =
        await BaseController.getTransformedData(
          req,
          userCurrentHospital,
          HospitalTransformer,
          {
            showPartailData: true,
          }
        );
      const transformedHospital = await BaseController.getTransformedData(
        req,
        userHospitals,
        HospitalTransformer,
        {
          showPartailData: true,
        }
      );
      const tokenObj = await GenerateToken(
        user,
        roles,
        App.lodash.head(hospitals),
        true
      );

      return res.success({
        ...tokenObj,
        user: transformeUser,
        currentHospital: transformedCurrentHospital,
        hospitals: transformedHospital,
      });
    } else {
      const tokenObj = await GenerateToken(
        user,
        [App.helpers.config('settings.roles.superAdmin.value')],
        [],
        true
      );
      const transformeUser = await BaseController.getTransformedData(
        req,
        user,
        UserTransformer,
        {
          roles: [App.helpers.config('settings.roles.superAdmin.value')],
        }
      );
      return res.success({
        ...tokenObj,
        user: transformeUser,
      });
    }
  },

  switchHospital: async (req, res) => {
    let { user, hospitals, currentHospital } = await new AuthService(
      req
    ).switchHospital(App.lodash.get(req.user, 'detail'), req.body);
    let { roles, userCurrentHospital, userHospitals } = GetHospitalRole(
      currentHospital,
      hospitals
    );
    console.log({ roles, userCurrentHospital, userHospitals });
    const transformeUser = await BaseController.getTransformedData(
      req,
      user,
      UserTransformer,
      {
        roles,
      }
    );
    const transformedCurrentHospital = await BaseController.getTransformedData(
      req,
      userCurrentHospital,
      HospitalTransformer,
      {
        showPartailData: true,
      }
    );
    const transformedHospital = await BaseController.getTransformedData(
      req,
      userHospitals,
      HospitalTransformer,
      {
        showPartailData: true,
      }
    );

    const tokenObj = await GenerateToken(user, roles, currentHospital, true);

    return res.success({
      ...tokenObj,
      user: transformeUser,
      currentHospital: transformedCurrentHospital,
      hospitals: transformedHospital,
    });
  },

  updateUser: async (req, res) => {
    await new AuthService(req).updateUser(req.body);
    res.noContent();
  },

  destroy: async (req, res) =>{
    const email = App.lodash.get(req.params, "email");
    const users = await new AuthService().destroy(email);
    res.send(users);
  },
};
