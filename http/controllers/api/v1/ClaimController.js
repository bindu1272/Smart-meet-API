const ClaimService = require('../../../../services/ClaimService');
const BaseController = require('./BaseController');
const {
  ClaimTransformer,
  ClaimTypesTransformer
} = require('../../../../transformers/Response/v1');

module.exports = {
  createClaim: async (req, res) => {
    await new ClaimService(req).createClaim(
      App.helpers.cloneObj(
        App.lodash.get(req, 'params'),
        App.lodash.get(req, 'body')
      )
    );
    res.noContent();
  },
  getClaims: async (req, res) => {
    const data = await new ClaimService(req).listClaims(
      App.helpers.cloneObj(
        App.lodash.get(req, 'params'),
        App.lodash.get(req, 'query')
      )
    );
    const transformedData = await BaseController.getTransformedData(
      req,
      data,
      ClaimTransformer
    );
    res.success(transformedData);
  },
  updateClaim: async (req, res) => {
    await new ClaimService(req).updateClaim(
      App.helpers.cloneObj(
        App.lodash.get(req, 'params'),
        App.lodash.get(req, 'body')
      )
    );
    res.noContent();
  },
  createClaimType: async (req, res) => {
    await new ClaimService(req).createClaimType(
      App.helpers.cloneObj(
        App.lodash.get(req, 'params'),
        App.lodash.get(req, 'body')
      )
    );
    res.noContent();
  },
  getClaimTypes: async (req, res) => {
    const data = await new ClaimService(req).getClaimTypes(
      App.helpers.cloneObj(
        App.lodash.get(req, 'params'),
        App.lodash.get(req, 'query')
      )
    );
    const transformedData = await BaseController.getTransformedData(
      req,
      data,
      ClaimTypesTransformer
    );
    res.success(transformedData);
  },
};
