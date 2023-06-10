const BaseRepository = require('./BaseRepository');
const { Ads } = require('../models');

class AdsRepository extends BaseRepository {
  constructor(req) {
    super();
    this.req = req;
    this.model = Ads;
  }

  async clearOrphanEntry() {
    await this.delete({
      where: {
        owner_id: null,
      },
    });
  }
  async deleteAds(inputId) {
    await this.model.destroy({
      where: {
        uuid: inputId,
      },
    });
  }
  async restoreAds(inputId) {
     await this.model.restore({
      where: {
        deletedAt: !null,
      },
    });
  }
}

module.exports = AdsRepository;
