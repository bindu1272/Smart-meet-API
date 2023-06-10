const BaseTransformer = require('./BaseTransformer');
const { DoctorDetail } = require('../../../models');

class DoctorDetailTransformer extends BaseTransformer {
  constructor(req, data, transformOptions = null) {
    super(req, data, transformOptions);
    this.model = DoctorDetail;
  }

  async transform(detail) {
    detail = await detail;
    let returnVal = {
      id: App.lodash.get(detail, 'uuid'),
      about: App.lodash.get(detail, 'about'),
      experience: App.lodash.get(detail, 'experience'),
      address_1: App.lodash.get(detail, 'address_1'),
      address_2: App.lodash.get(detail, 'address_2'),
      suburb: App.lodash.get(detail, 'suburb'),
      state: App.lodash.get(detail, 'state'),
      country: App.lodash.get(detail, 'country'),
      pin_code: App.lodash.get(detail, 'pin_code'),
      qualifications: App.lodash.get(detail, 'qualifications'),
      features: App.lodash.get(detail, 'features'),
      rating: App.lodash.get(detail, 'rating'),
      rating_count: App.lodash.get(detail, 'rating_count'),
      user_id : App.lodash.get(detail,'user_id'),
      provider_number : App.lodash.get(detail,'provider_number')
    };
    return returnVal;
  }
}

module.exports = DoctorDetailTransformer;
