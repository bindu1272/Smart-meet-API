const BaseTransformer = require('./BaseTransformer');
const { InvitationLink } = require('../../../models');

class PendingInvitationTransformer extends BaseTransformer {
  constructor(req, data, transformOptions = null) {
    super(req, data, transformOptions);
    this.model = InvitationLink;
  }

  async transform(invitaionLink) {
    invitaionLink = await invitaionLink;
    let returnVal = {
      uuid: App.lodash.get(invitaionLink, 'id'),
      status: App.lodash.get(invitaionLink, 'status'),
      email: App.lodash.get(invitaionLink, 'email'),
      owner_type: App.lodash.get(invitaionLink, 'owner_type'),
      data: App.lodash.get(invitaionLink, 'data'),
    };
    return returnVal;
  }
}

module.exports = PendingInvitationTransformer;
