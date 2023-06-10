const BaseTransformer = require('./BaseTransformer');
const { Notifications } = require('../../../models');

class NotificationsTransformer extends BaseTransformer {
  constructor(req, data, transformOptions = null) {
    super(req, data, transformOptions);
    this.model = Notifications;
  }

  async transform(notifications) {
    notifications = await notifications;
    let returnVal = {
      id: App.lodash.get(notifications, 'id'),
      uuid: App.lodash.get(notifications, 'uuid'),
      text: App.lodash.get(notifications, 'text'),
      image: App.helpers.getImageUrl(notifications.getData('image')),
      owner_id : App.lodash.get(notifications,'owner_id'),
      start_date : App.lodash.get(notifications,'start_date'),
      end_date : App.lodash.get(notifications,'end_date'),
      isSponsor : App.lodash.get(notifications,'isSponsor')
    };
    return returnVal;
  }
}

module.exports = NotificationsTransformer;
