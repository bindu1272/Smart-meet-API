const BaseRepository = require('./BaseRepository');
const { Specialization } = require('../models');

class SpecializationRepository extends BaseRepository {
  constructor(req) {
    super();
    this.req = req;
    this.model = Specialization;
  }
}

module.exports = SpecializationRepository;
