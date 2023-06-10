const BaseTransformer = require("./BaseTransformer");
const { ScreenQuestionsLink } = require("../../../models");
const {
  ScreenQuestionsLinkRepository,
  HospitalRepository,
  DoctorDetailRepository,
  UserRepository,
  ScreenQuestionsRepository,
} = require("../../../repositories");

class ScreenQuestionsLinkTransformer extends BaseTransformer {
  constructor(req, data, transformOptions = null) {
    super(req, data, transformOptions);
    this.model = ScreenQuestionsLink;
    this.questionsRepo = new ScreenQuestionsRepository(req);
    this.hospitalRepo = new HospitalRepository(req);
    this.userRepo = new UserRepository(req);
    this.doctorDetailRepo = new DoctorDetailRepository(req);
  }
  async transform(screenQuestionsLink) {
    screenQuestionsLink = await screenQuestionsLink;
    let returnVal = {
      id: App.lodash.get(screenQuestionsLink, "id"),
      uuid: App.lodash.get(screenQuestionsLink, "type"),
      question_id: App.lodash.get(screenQuestionsLink, "question_id"),
      owner_id: App.lodash.get(screenQuestionsLink, "owner_id"),
      owner_type: App.lodash.get(screenQuestionsLink, "owner_type"),
      is_include: App.lodash.get(screenQuestionsLink, "is_include"),
    };

    if (screenQuestionsLink?.question_id) {
      const question = await this.questionsRepo.getBy({
        id: App.lodash.get(screenQuestionsLink, "question_id"),
      });
      returnVal["question"] = await this.getQuestion(question);
    }
    if (screenQuestionsLink?.owner_id) {
      if(screenQuestionsLink?.owner_type === "hospital"){
        const hospital = await this.hospitalRepo.getBy({
          id: App.lodash.get(screenQuestionsLink, "owner_id"),
        });
        returnVal["hospital"] = await this.getHospital(hospital);
      }
      if(screenQuestionsLink?.owner_type === "doctor"){
        const doctor = await this.doctorDetailRepo.getBy({
          id: App.lodash.get(screenQuestionsLink, "owner_id"),
        });
        if (doctor) {
          const doctorUser = await this.getDoctor(doctor);
          if (doctorUser) {
            const user = await this.userRepo.getBy({
              id: App.lodash.get(doctorUser, "user_id"),
            });
            returnVal["doctor"] = await this.getUser(user);
          }
        }
      }
    }
    return returnVal;
  }
  async getQuestion(question) {
    if (!question) {
      return null;
    }
    let transformer = require("./ScreenQuestionsTransformer");
    return await new transformer(this.req, question, {}).init();
  }
  async getHospital(hospital) {
    if (!hospital) {
      return null;
    }
    let transformer = require("./HospitalTransformer");
    return await new transformer(this.req, hospital, {}).init();
  }
  async getDoctor(doctor) {
    if (!doctor) {
      return null;
    }
    let transformer = require("./DoctorDetailTransformer");
    return await new transformer(this.req, doctor, {}).init();
  }
  async getUser(user) {
    if (!user) {
      return null;
    }
    let transformer = require("./UserTransformer");
    return await new transformer(this.req, user, {}).init();
  }
}

module.exports = ScreenQuestionsLinkTransformer;
