const BaseTransformer = require('./BaseTransformer');
const { ClaimTypes } = require('../../../models');

class ClaimTypesTransformer extends BaseTransformer {
  constructor(req, data, transformOptions = null) {
    super(req, data, transformOptions);
    this.model = ClaimTypes;
  }
  async transform(claimTypes) {
    claimTypes = await claimTypes;
    let returnVal = {
      id: App.lodash.get(claimTypes, 'id'),
      uuid: App.lodash.get(claimTypes, 'uuid'),
      type: App.lodash.get(claimTypes,'type')
    };
    return returnVal;
  }
}

module.exports = ClaimTypesTransformer;
