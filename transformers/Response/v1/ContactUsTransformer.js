const BaseTransformer = require('./BaseTransformer');
const { ContactUs } = require('../../../models');

class ContactUsTransformer extends BaseTransformer {
  constructor(req, data, transformOptions = null) {
    super(req, data, transformOptions);
    this.model = ContactUs;
  }

  async transform(contactUs) {
    contactUs = await contactUs;
    let returnVal = {
      id: App.lodash.get(contactUs, 'id'),
      name: App.lodash.get(contactUs, 'name'),
      email: App.lodash.get(contactUs, 'email'),
      phone: App.lodash.get(contactUs, 'phone'),
      comments: App.lodash.get(contactUs, 'comments'),
      uuid : App.lodash.get(contactUs,'uuid'),
      image_url : App.lodash.get(contactUs,'image_url'),
      image : App.lodash.get(contactUs,'image')
    };
    if ('user' in contactUs) {
      returnVal['user'] = await this.getUser(
        contactUs.getData('user')
      );
    }
    return returnVal;
  }
  async getUser(user) {
    if (!user) {
      return null;
    }
    let transformer = require('./UserTransformer');
    return await new transformer(this.req, user, {}).init();
  }
}

module.exports = ContactUsTransformer;
