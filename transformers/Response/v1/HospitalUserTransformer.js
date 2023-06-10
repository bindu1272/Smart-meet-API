const BaseTransformer = require('./BaseTransformer');
const { HospitalUser } = require('../../../models');

class HospitalUserTransformer extends BaseTransformer {
  constructor(req, data, transformOptions = null) {
    super(req, data, transformOptions);
    this.model = HospitalUser;
  }

  async transform(hospitalUser) {
    hospitalUser = await hospitalUser;

    let returnVal = {
      hospital: await this.getHospital(
        App.lodash.get(hospitalUser, 'hospital_user_hospital')
      ),
      doctor: await this.getDoctor(
        App.lodash.get(hospitalUser, 'hospital_user_user')
      ),
    };
    return returnVal;
  }

  async getHospital(hospital) {
    let transformer = require('./HospitalTransformer');
    return await new transformer(this.req, hospital, {}).init();
  }

  async getDoctor(doctor) {
    let transformer = require('./UserTransformer');
    return await new transformer(this.req, doctor, {}).init();
  }
}

module.exports = HospitalUserTransformer;
