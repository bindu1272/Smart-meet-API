const ContactUsService = require("../../../../services/ContactUsService");
const BaseController = require("./BaseController");

const {
  ContactUsTransformer,
} = require("../../../../transformers/Response/v1");

module.exports = {
  staffContactUs: async (req, res) => {
    await new ContactUsService(req).contactUs(
      App.helpers.cloneObj(App.lodash.get(req, "body"))
    );
    return res.success("record inserted successfully");
  },
  // getAll: async (req, res) => {
  //   const results = await new ContactUsService(req).getAll(
  //     App.helpers.cloneObj(req.query, req.params)
  //   );
  //   const transformedData = await BaseController.getTransformedData(
  //     req,
  //     results,
  //     ContactUsTransformer
  //   );
  //   res.success(transformedData);
  // },
  getAll: async (req, res) => {
    const results = await new ContactUsService(req).getAll(
      App.helpers.cloneObj(req.page, req.query)
    );
    const transformedData = await BaseController.getTransformedDataWithPagination(
      req,
      results,
      ContactUsTransformer
    );
    res.success(transformedData);
  },
  delete: async (req, res) => {
    await new ContactUsService(req).delete(
      App.helpers.cloneObj(
        App.lodash.get(req, "params"),
        App.lodash.get(req, "body")
      )
    );
    res.success("deleted record successfully");
  },
  get: async (req, res) => {
    const results = await new ContactUsService(req.params).get(
      App.helpers.cloneObj(req.query, req.params)
    );
    const transformedData = await BaseController.getTransformedData(
      req,
      results,
      ContactUsTransformer
    );
    res.success(transformedData);
  },
};
