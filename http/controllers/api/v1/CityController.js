const BaseController = require('./BaseController');
const CityService = require('../../../../services/CityService');
const { CityTransformer } = require('../../../../transformers/Response/v1');

module.exports = {
  create: async (req, res) => {
    await new CityService(req).create(
      App.helpers.cloneObj(req.body, req.params)
    );
    res.noContent();
  },

  update: async (req, res) => {
    await new CityService(req).update(
      App.helpers.cloneObj(req.body, req.params)
    );
    res.noContent();
  },

  listCities: async (req, res) => {
    const results = await new CityService(req).listCities(
      App.helpers.cloneObj(req.query, req.params)
    );
    const transformedData = await BaseController.getTransformedData(
      req,
      results,
      CityTransformer
    );
    res.success(transformedData);
  },
  deleteCity : async(req,res)=>{
    await new CityService(req).deleteCity(
      App.helpers.cloneObj(
        App.lodash.get(req, "params"),
        App.lodash.get(req, "body")
      )
    );
    res.success("deleted record successfully");
  }
};
