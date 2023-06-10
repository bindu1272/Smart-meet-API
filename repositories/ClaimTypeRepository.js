const BaseRepository = require('./BaseRepository');
const { ClaimTypes } = require('../models');

class ClaimTypeRepository extends BaseRepository {
    constructor(req) {
        super();
        this.req = req;
        this.model = ClaimTypes;
    }
}

module.exports = ClaimTypeRepository;
