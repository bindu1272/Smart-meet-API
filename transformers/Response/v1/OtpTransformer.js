const BaseTransformer = require('./BaseTransformer');
const { Otp } = require('../../../models');

class OtpTransformer extends BaseTransformer {
  constructor(req, data, transformOptions = null) {
    super(req, data, transformOptions);
    this.model = Otp;
  }

  async transform(otp) {
    otp = await otp;

    let returnVal = {
      id: App.lodash.get(otp, 'uuid'),
      // otp: App.lodash.get(otp, 'otp'),
      owner: App.lodash.get(otp, 'owner'),
    };
    return returnVal;
  }
}

module.exports = OtpTransformer;
