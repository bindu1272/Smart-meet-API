var Validator = require("./Validator");

class HospitalAgentValidator extends Validator {
  /**
   * Validation rules.
   *
   * @param  string type
   * @param  array data
   * @return Object
   */
  getRules(type, data = {}) {
    let rules = {};

    switch (type) {
      case "invite-hospital-agent":
        rules = {
          email: "required|email",
          role: `required|in:${App.lodash
            .map(App.helpers.config("settings.roles"), "value")
            .join(",")}`,
        };
        break;
      case "send-invitation":
        rules = {
          email: "required|email",
        };
        break;
      case "validate-link":
        rules = {
          uuid: "required|exist:InvitationLink,uuid",
        };
        break;
      case "register-hospital-agent-validate-link":
        rules = {
          user_exists: "required|boolean",
          invite_link_uuid: "required|exist:InvitationLink,uuid",
        };
        break;
      case "register-user-details":
        rules = {
          title: "required",
          name: "required",
          email: "required",
          contact_code: "required",
          contact_number: "required",
          password: "required|min:6",
          confirm_password: "required|min:6",
        };
        break;
    }
    return rules;
  }
  getMessages(type) {
    let messages = {};
    switch (type) {
    }

    return messages;
  }
}

module.exports = HospitalAgentValidator;
