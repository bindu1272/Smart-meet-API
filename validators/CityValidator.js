var Validator = require('./Validator');

class CityValidator extends Validator {
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
      case 'create-city':
        rules = {
          name: 'required',
          country: 'required',
          lat: 'required|numeric',
          lng: 'required|numeric',
          ne_lat: 'required|numeric',
          sw_lat: 'required|numeric',
          ne_lng: 'required|numeric',
          sw_lng: 'required|numeric',
        };
        break;

      case 'update-city':
        rules = {
          uuid: 'required|exist:City,uuid',
          name: 'required',
          country: 'required',
          lat: 'required|numeric',
          lng: 'required|numeric',
          ne_lat: 'required|numeric',
          sw_lat: 'required|numeric',
          ne_lng: 'required|numeric',
          sw_lng: 'required|numeric',
        };
        break;

      case 'search':
        rules = {
          city_uuid: 'required|exist:City,uuid',
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

module.exports = CityValidator;
