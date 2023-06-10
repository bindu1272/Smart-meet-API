const BaseRepository = require('./BaseRepository');
const { AdditionalDetails } = require('../models');

class AdditionalDetailsRepository extends BaseRepository {
  constructor(req) {
    super();
    this.req = req;
    this.model = AdditionalDetails;
  }
}
module.exports = AdditionalDetailsRepository;
