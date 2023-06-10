const BaseRepository = require('./BaseRepository');
const { Member } = require('../models');

class MemberRepository extends BaseRepository {
  constructor(req) {
    super();
    this.req = req;
    this.model = Member;
  }
}

module.exports = MemberRepository;
