const BaseRepository = require('./BaseRepository');
const { Claim } = require('../models');

class ClaimRepository extends BaseRepository {
    constructor(req) {
        super();
        this.req = req;
        this.model = Claim;
    }
}

module.exports = ClaimRepository;
