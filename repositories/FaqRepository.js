const BaseRepository = require('./BaseRepository');
const { Faq } = require('../models');

class FaqRepository extends BaseRepository {
  constructor(req) {
    super();
    this.req = req;
    this.model = Faq;
  }

  async clearOrphanEntry() {
    await this.delete({
      where: {
        owner_id: null,
      },
    });
  }
}

module.exports = FaqRepository;
