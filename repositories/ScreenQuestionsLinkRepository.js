const BaseRepository = require('./BaseRepository');
const { ScreenQuestionsLink } = require('../models');

class ScreenQuestionsLinkRepository extends BaseRepository {
  constructor(req) {
    super();
    this.req = req;
    this.model = ScreenQuestionsLink;
  }
  async deleteQuestionLink(inputId) {
    await this.model.destroy({
      where: {
        question_id: inputId,
      },
    });
  }
  async deleteQuestionLinkByUuid(inputId) {
    await this.model.destroy({
      where: {
        uuid: inputId,
      },
    });
  }
}

module.exports = ScreenQuestionsLinkRepository;
