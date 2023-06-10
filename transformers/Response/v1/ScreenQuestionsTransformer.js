const BaseTransformer = require("./BaseTransformer");
const { ScreenQuestions } = require("../../../models");
const {
  ScreenQuestionsLinkRepository,
  HospitalRepository,
  DoctorDetailRepository,
  UserRepository,
} = require("../../../repositories");

class ScreenQuestionsTransformer extends BaseTransformer {
  constructor(req, data, transformOptions = null) {
    super(req, data, transformOptions);
    this.model = ScreenQuestions;
    this.questionsLinkRepo = new ScreenQuestionsLinkRepository();
    this.hospitalRepo = new HospitalRepository();
    this.doctorDetailRepo = new DoctorDetailRepository();
    this.userRepo = new UserRepository();
  }
  async transform(screenQuestions) {
    screenQuestions = await screenQuestions;
    let returnVal = {
      id: App.lodash.get(screenQuestions, "id"),
      uuid: App.lodash.get(screenQuestions, "uuid"),
      question: App.lodash.get(screenQuestions, "question"),
      options: App.lodash.get(screenQuestions, "options"),
      type: App.lodash.get(screenQuestions, "type"),
    };
    return returnVal;
  }
}
module.exports = ScreenQuestionsTransformer;
