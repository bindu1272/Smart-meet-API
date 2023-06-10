const BaseRepository = require('./BaseRepository');
const { WorkingHour } = require('../models');

class WorkingHourRepository extends BaseRepository {
  constructor(req) {
    super();
    this.req = req;
    this.model = WorkingHour;
  }

  async clearOrphanEntry() {
    return await this.delete({
      where: {
        owner_id: null,
      },
    });
  }

  async destroy(id) {
    await this.delete({
      where: { owner_id: id },
    });
    return {
      message: "deleted successfully",
    };
  }
}

module.exports = WorkingHourRepository;
