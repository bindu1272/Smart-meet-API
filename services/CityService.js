const { CityRepository, HospitalRepository } = require('../repositories');
const CityValidator = require('../validators/CityValidator');
const sequelize = require('sequelize');
const GenericError = require('../errors/GenericError');

class CityService {
  constructor(req) {
    this.req = req;
    this.cityRepo = new CityRepository();
    this.hospitalRepo = new HospitalRepository();
    this.cityValidator = new CityValidator();
  }

  async create(inputs) {
    await this.cityValidator.validate(inputs, 'create-city');
    let cityExists = await this.cityRepo.getBy({
      name: App.lodash.get(inputs, 'name'),
    });
    if (cityExists) {
      throw new GenericError(
        App.helpers.config('messages.errorMessages.city.alreadyExists')
      );
    }
    await this.cityRepo.create(inputs);
    return;
  }

  async update(inputs) {
    await this.cityValidator.validate(inputs, 'update-city');
    await this.cityRepo.update(inputs, {
      where: {
        uuid: App.lodash.get(inputs, 'uuid'),
      },
    });
    return;
  }

  async listCities(inputs) {
    return await this.cityRepo.getFor();
  }

  async getCityLatLong(inputs) {
    await this.cityValidator.validate(inputs, 'search');
    let userLocation = false;
    const city = await this.cityRepo.getBy({
      uuid: App.lodash.get(inputs, 'city_uuid'),
    });

    let latitude = App.lodash.get(inputs, 'lat');
    let longitude = App.lodash.get(inputs, 'lng');
    console.log(latitude, longitude);
    if (latitude && longitude) {
      userLocation = true;
    }

    if (!latitude) {
      latitude = App.lodash.get(city, 'lat');
    }

    if (!longitude) {
      longitude = App.lodash.get(city, 'lng');
    }

    return {
      city,
      userLocation,
      latitude,
      longitude,
    };
  }
  async deleteCity(inputs) {
    // await this.ContactUsValidator.validate(inputs,'delete');
    return await this.cityRepo.deleteCity(inputs.uuid);
}
}

module.exports = CityService;
