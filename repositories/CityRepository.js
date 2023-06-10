const BaseRepository = require('./BaseRepository');
const { City } = require('../models');

class CityRepository extends BaseRepository {
  constructor(req) {
    super();
    this.req = req;
    this.model = City;
  }
  async deleteCity(inputId) {
    await this.model.destroy({
      where: {
        uuid: inputId,
      },
    });
  }
  async restoreCity(inputId) {
    await this.model.restore({
      where: {
        uuid: inputId,
      },
    });
  }
}

module.exports = CityRepository;
