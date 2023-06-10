var Validator = require("./Validator");

class ClaimValidator extends Validator {
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
      case "create-claim":
        rules = {
          appointment_id: "required",
          // country: 'required',
          // lat: 'required|numeric',
          // lng: 'required|numeric',
          // ne_lat: 'required|numeric',
          // sw_lat: 'required|numeric',
          // ne_lng: 'required|numeric',
          // sw_lng: 'required|numeric',
        };
        break;
      case "create-type":
        rules = {
          type: "required",
        };
        break;
      case "update-claim":
        rules = {
          id: "required|exist:Claim,id",
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

module.exports = ClaimValidator;
