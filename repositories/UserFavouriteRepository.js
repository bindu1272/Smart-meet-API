const BaseRepository = require('./BaseRepository');
const { UserFavourite } = require('../models');

class UserFavouriteRepository extends BaseRepository {
  constructor(req) {
    super();
    this.req = req;
    this.model = UserFavourite;
  }
}

module.exports = UserFavouriteRepository;
