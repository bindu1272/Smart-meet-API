const BaseRepository = require('./BaseRepository');
const { LeaveHour } = require('../models');

class LeaveHourRepository extends BaseRepository {
  constructor(req) {
    super();
    this.req = req;
    this.model = LeaveHour;
  }

  async clearLeaveHours() {
    await this.delete({
      where: {
        leave_id: null,
      },
    });
  }
}

module.exports = LeaveHourRepository;
