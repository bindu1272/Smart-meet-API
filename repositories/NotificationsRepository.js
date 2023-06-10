const BaseRepository = require('./BaseRepository');
const { Notifications } = require('../models');

class NotificationsRepository extends BaseRepository {
  constructor(req) {
    super();
    this.req = req;
    this.model = Notifications;
  }

  async clearOrphanEntry() {
    await this.delete({
      where: {
        owner_id: null,
      },
    });
  }
  async deleteNotifications(inputId) {
    await this.model.destroy({
      where: {
        uuid: inputId,
      },
    });
  }
  async restoreNotifications(inputId) {
     await this.model.restore({
      where: {
        deletedAt: !null,
      },
    });
  }
}

module.exports = NotificationsRepository;
