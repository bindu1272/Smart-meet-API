const BaseTransformer = require('./BaseTransformer');
const { City } = require('../../../models');
const { AppointmentRepository } = require('../../../repositories');

class CityTransformer extends BaseTransformer {
  constructor(req, data, transformOptions = null) {
    super(req, data, transformOptions);
    this.model = City;
  }

  async transform(city) {
    city = await city;

    let returnVal = {
      id: App.lodash.get(city, 'uuid'),
      name: App.lodash.get(city, 'name'),
      country: App.lodash.get(city, 'country'),
      lat: App.lodash.get(city, 'lat'),
      lng: App.lodash.get(city, 'lng'),
      ne_lat: App.lodash.get(city, 'ne_lat'),
      sw_lat: App.lodash.get(city, 'sw_lat'),
      ne_lng: App.lodash.get(city, 'ne_lng'),
      sw_lng: App.lodash.get(city, 'sw_lng'),
      radius: App.helpers.getRadius(
        App.lodash.get(city, 'ne_lat'),
        App.lodash.get(city, 'ne_lng'),
        App.lodash.get(city, 'sw_lat'),
        App.lodash.get(city, 'sw_lng')
      ),
      is_active: App.lodash.get(city, 'is_active'),
    };
    return returnVal;
  }
}

module.exports = CityTransformer;
