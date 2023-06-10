const BaseRepository = require('./BaseRepository');
const { ScreenQuestions } = require('../models');

class ScreenQuestionsRepository extends BaseRepository {
  constructor(req) {
    super();
    this.req = req;
    this.model = ScreenQuestions;
  }

  async clearOrphanEntry() {
    await this.delete({
      where: {
        owner_id: null,
      },
    });
  }
  async deleteScreenQuestion(inputId) {
    await this.model.destroy({
      where: {
        uuid: inputId,
      },
    });
  }
  async restoreScreenQuestion(inputId) {
     await this.model.restore({
      where: {
        deletedAt: !null,
      },
    });
  }
}

module.exports = ScreenQuestionsRepository;
