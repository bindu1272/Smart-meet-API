const SpecialisationService = require('../../../../services/SpecialisationService');
const BaseController = require('./BaseController');
const {
  SpecialisationTransformer,
} = require('../../../../transformers/Response/v1');

module.exports = {
  index: async (req, res) => {
    const data = await new SpecialisationService().search(
      App.helpers.cloneObj(
        App.lodash.get(req, 'params'),
        App.lodash.get(req, 'body')
      )
    );
    let transformedData = await BaseController.getTransformedData(
      req,
      data,
      SpecialisationTransformer
    );
    return res.success(transformedData);
  },
};
