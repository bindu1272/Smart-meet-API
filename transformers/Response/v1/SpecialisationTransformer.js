const BaseTransformer = require('./BaseTransformer');
const { Specialization } = require('../../../models');

class SpecialisationTransformer extends BaseTransformer {
  constructor(req, data, transformOptions = null) {
    super(req, data, transformOptions);
    this.model = Specialization;
  }

  async transform(spec) {
    spec = await spec;
    let returnVal = {
      id: App.lodash.get(spec, 'uuid'),
      name: App.lodash.get(spec, 'name'),
      small_image: App.helpers.getImageUrl(App.lodash.get(spec, 'small_image')),
      large_image: App.helpers.getImageUrl(App.lodash.get(spec, 'large_image')),
    };
    return returnVal;
  }
}

module.exports = SpecialisationTransformer;
