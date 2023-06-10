const HospitalService = require('../../../../services/HospitalService');
const DoctorService = require('../../../../services/DoctorService');
const CityService = require('../../../../services/CityService');
const BaseController = require('./BaseController');
const {
  OtpTransformer,
  HospitalTransformer,
  HospitalUserTransformer,
  AdsTransformer,
  NotificationsTransformer,
  ScreenQuestionsTransformer,
  ScreenQuestionsLinkTransformer
} = require('../../../../transformers/Response/v1');

module.exports = {
  validateHospitalRegistrationEmail: async (req, res) => {
    const data = await new HospitalService().validateHospitalRegistrationEmail(
      App.helpers.cloneObj(
        App.lodash.get(req, 'params'),
        App.lodash.get(req, 'body')
      )
    );
    res.success(data);
  },

  validateHospital: async (req, res) => {
    const data = await new HospitalService().validateHospital(
      App.helpers.cloneObj(
        App.lodash.get(req, 'params'),
        App.lodash.get(req, 'body')
      )
    );
    if (App.lodash.get(req, 'body.step') === 1) {
      let transformedData = await BaseController.getTransformedData(
        req,
        data,
        OtpTransformer
      );
      return res.success(transformedData);
    }
    res.noContent();
  },

  registerHospital: async (req, res) => {
    await new HospitalService().registerHospital(
      App.helpers.cloneObj(
        App.lodash.get(req, 'params'),
        App.lodash.get(req, 'body')
      )
    );
    res.noContent();
  },

  getHosptalList: async (req, res) => {
    let hospitals = await new HospitalService(req).getHosptalList(
      App.helpers.cloneObj(
        App.lodash.get(req, 'params'),
        App.lodash.get(req, 'query')
      )
    );

    let transformedData = await BaseController.getTransformedDataWithPagination(
      req,
      hospitals,
      HospitalTransformer
    );
    return res.success(transformedData);
  },
  getHospitals: async (req,res) =>{
    let hospitals = await new HospitalService(req).getHospitals(
      App.helpers.cloneObj(req.query,req.params)
    );
    let transformedData = await BaseController.getTransformedDataWithPagination(
      req,
      hospitals,
      HospitalTransformer
    );
    return res.success(transformedData);
  },

  getSingleHosptalList: async (req, res) => {
    let hospitals = await new HospitalService(req).getSingleHosptalList(
      App.helpers.cloneObj(
        App.lodash.get(req, 'params'),
        App.lodash.get(req, 'body')
      )
    );

    let transformedData = await BaseController.getTransformedData(
      req,
      hospitals,
      HospitalTransformer,
      {
        showFavourites: true,
      }
    );
    return res.success(transformedData);
  },

  updateHospitalStatus: async (req, res) => {
    await new HospitalService(req).updateHospitalStatus(
      App.helpers.cloneObj(
        App.lodash.get(req, 'params'),
        App.lodash.get(req, 'body')
      )
    );
    res.noContent();
  },

  updateHospitalBillingType: async (req, res) => {
    await new HospitalService(req).updateHospitalBillingType(
      App.helpers.cloneObj(
        App.lodash.get(req, 'params'),
        App.lodash.get(req, 'body')
      )
    );
    res.noContent();
  },

  updateHospital: async (req, res) => {
    await new HospitalService(req).updateHospitalDetails(
      App.helpers.cloneObj(
        App.lodash.get(req, 'params'),
        App.lodash.get(req, 'body')
      )
    );
    res.noContent();
  },

  getHospitalFaqs: async (req, res) => {
    let faqs = await new HospitalService(req).getHospitalFaqs(
      App.lodash.get(req, 'params')
    );
    res.success(faqs);
  },
  getHospitalAds: async (req, res) => {
    let ads = await new HospitalService(req).getHospitalAds(
      App.lodash.get(req, 'params')
    );
    let transformedData = await BaseController.getTransformedData(
      req,
      ads,
      AdsTransformer,
    );
    res.success(transformedData);
  },
  getHospitalAd: async (req, res) => {
    let ads = await new HospitalService(req).getHospitalAd(
      App.lodash.get(req, 'params')
    );
    let transformedData = await BaseController.getTransformedData(
      req,
      ads,
      AdsTransformer,
    );
    res.success(transformedData);
  },
  getHospitalNotifications: async (req, res) => {
    let notifications = await new HospitalService(req).getHospitalNotifications(
      App.lodash.get(req, 'params')
    );
    let transformedData = await BaseController.getTransformedData(
      req,
      notifications,
      NotificationsTransformer,
    );
    res.success(transformedData);
  },
  getHospitalQuestions: async (req, res) => {
    let questions = await new HospitalService(req).getHospitalQuestions(
      App.lodash.get(req, 'params')
    );
    let transformedData = await BaseController.getTransformedData(
      req,
      questions,
      ScreenQuestionsLinkTransformer,
    );
    res.success(transformedData);
  },
  getHospitalNotification: async (req, res) => {
    let notification = await new HospitalService(req).getHospitalNotification(
      App.lodash.get(req, 'params')
    );
    let transformedData = await BaseController.getTransformedData(
      req,
      notification,
      NotificationsTransformer,
    );
    res.success(transformedData);
  },
  getHospitalDoctor: async (req, res) => {
    const { city, latitude, longitude, userLocation } = await new CityService(
      req
    ).getCityLatLong(
      App.helpers.cloneObj(
        App.lodash.get(req, 'params'),
        App.lodash.get(req, 'query')
      )
    );

    let hospitals = await new HospitalService(req).getHosptalListFormWeb(
      App.helpers.cloneObj(
        { city, latitude, longitude, userLocation },
        App.lodash.get(req, 'query')
      )
    );

    let trasnformedHospital = await BaseController.getTransformedData(
      req,
      hospitals,
      HospitalTransformer
    );

    let doctors = await new DoctorService(req).getDoctorForWeb(
      App.helpers.cloneObj(
        App.lodash.get(req, 'params'),
        App.lodash.get(req, 'query')
      )
    );

    const transformedDoctors = await BaseController.getTransformedData(
      req,
      doctors,
      HospitalUserTransformer
    );

    res.success({
      hospitals: trasnformedHospital,
      doctors: transformedDoctors,
    });
  },

  createHospitalFaqs: async (req, res) => {
    await new HospitalService(req).createHospitalFaqs(
      App.lodash.get(req, 'body')
    );
    res.noContent();
  },
  getDoctorsHospital: async (req, res) => {
    const hospitalUserData = await new HospitalService(req).getDoctorsHospital(
      App.lodash.get(req, 'params'),
      App.lodash.get(req, 'body')
    );
    res.success({
      hospitals: hospitalUserData
    });
  },
  createHospitalAds: async (req, res) => {
    await new HospitalService(req).createHospitalAds(
      App.lodash.get(req, 'body')
    );
    res.noContent();
  },
  deleteAds : async(req,res)=>{
    await new HospitalService(req).deleteAds(
      App.helpers.cloneObj(
        App.lodash.get(req, "params"),
        App.lodash.get(req, "body")
      )
    );
    res.success("deleted record successfully");
  },
  updateAds: async (req, res) => {
    await new HospitalService(req).updateAds(
      App.helpers.cloneObj(
        App.lodash.get(req, 'params'),
        App.lodash.get(req, 'body')
      )
    );
    res.noContent();
  },
  createHospitalNotifications: async (req, res) => {
    await new HospitalService(req).createHospitalNotifications(
      App.lodash.get(req, 'body')
    );
    res.noContent();
  },
  createHospitalQuestion: async (req, res) => {
    await new HospitalService(req).createHospitalQuestion(
      App.lodash.get(req, 'body')
    );
    res.noContent();
  },
  deleteNotifications : async(req,res)=>{
    await new HospitalService(req).deleteNotifications(
      App.helpers.cloneObj(
        App.lodash.get(req, "params"),
        App.lodash.get(req, "body")
      )
    );
    res.success("deleted record successfully");
  },
  updateNotifications: async (req, res) => {
    await new HospitalService(req).updateNotifications(
      App.helpers.cloneObj(
        App.lodash.get(req, 'params'),
        App.lodash.get(req, 'body')
      )
    );
    res.noContent();
  },
  deleteQuestion : async(req,res)=>{
    await new HospitalService(req).deleteQuestion(
      App.helpers.cloneObj(
        App.lodash.get(req, "params"),
        App.lodash.get(req, "body")
      )
    );
    res.success("deleted record successfully");
  },
  updateQuestion: async (req, res) => {
    await new HospitalService(req).updateQuestion(
      App.helpers.cloneObj(
        App.lodash.get(req, 'params'),
        App.lodash.get(req, 'body')
      )
    );
    res.noContent();
  },

};
