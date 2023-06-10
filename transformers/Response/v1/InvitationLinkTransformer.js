const BaseTransformer = require("./BaseTransformer");
const { InvitationLink } = require("../../../models");

class InvitationLinkTransformer extends BaseTransformer {
  constructor(req, data, transformOptions = null) {
    super(req, data, transformOptions);
    this.model = InvitationLink;
  }

  async transform(invitationLink) {
    invitationLink = await invitationLink;
    let returnVal = {
      id: App.lodash.get(invitationLink, "id"),
      uuid: App.lodash.get(invitationLink, "uuid"),
      owner: App.lodash.get(invitationLink, "owner"),
      email: App.lodash.get(invitationLink, "email"),
      owner_type: App.lodash.get(invitationLink, "owner_type"),
      data: App.lodash.get(invitationLink, "data"),
    };
    return returnVal;
  }
}

module.exports = InvitationLinkTransformer;
