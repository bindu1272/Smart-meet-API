const BaseTransformer = require('./BaseTransformer');
const { HospitalUser } = require("../../../models");
const {
    UserRepository,
    HospitalRepository
  } = require('../../../repositories');


class HospitalAgentTransformer extends BaseTransformer {
  constructor(req, data, transformOptions = null) {
    super(req, data, transformOptions);
    this.model = HospitalUser;
    this.userRepo = new UserRepository();
    this.hospitalRepo = new HospitalRepository();
  }

  async transform(hospitalUser) {
    hospitalUser = await hospitalUser;
    let returnVal = {
      id: App.lodash.get(hospitalUser, "id"),
      uuid: App.lodash.get(hospitalUser, "uuid"),
      user_id: App.lodash.get(hospitalUser, "user_id"),
      role_id: App.lodash.get(hospitalUser,"role_id"),
      hospital_id: App.lodash.get(hospitalUser,"hospital_id")
    };
    if ('user_id' in hospitalUser) {
        const user = await this.userRepo.getBy({
            id : App.lodash.get(hospitalUser, "user_id")
          })
        returnVal['user'] = await this.getUser(
          user
        );
      }
      if ('hospital_id' in hospitalUser) {
        const hospital = await this.hospitalRepo.getBy({
            id : App.lodash.get(hospitalUser, "hospital_id")
          })
        returnVal['hospital'] = await this.getHospital(
          hospital
        );
      }
      return returnVal;
    }
    async getUser(user) {
      if (!user) {
        return null;
      }
      let transformer = require('./UserTransformer');
      return await new transformer(this.req, user, {}).init();
    }
    async getHospital(hospital) {
      if (!hospital) {
        return null;
      }
      let transformer = require('./HospitalTransformer');
      return await new transformer(this.req, hospital, {}).init();
    }
}

module.exports = HospitalAgentTransformer;
