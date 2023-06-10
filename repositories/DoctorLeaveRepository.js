const BaseRepository = require('./BaseRepository');
const { Op } = require('sequelize');
const { DoctorLeave, LeaveHour } = require('../models');

class DoctorLeaveRepository extends BaseRepository {
  constructor(req) {
    super();
    this.req = req;
    this.model = DoctorLeave;
  }

  async search(searchObj, isPaginated = true) {
    let criteria = {};
    let includesArr = [];
    let checkObj = {};
    checkObj['$and'] = [];

    if ('hospital_user_id' in searchObj) {
      checkObj['$and'].push({
        hospital_user_id: searchObj['hospital_user_id'],
      });
    }
    includesArr.push({
      model: LeaveHour,
      as: 'leave_hours',
    });
    criteria['where'] = { [Op.and]: checkObj['$and'] };
    criteria['include'] = includesArr;
    return isPaginated
      ? this.paginate(criteria, null, { include: includesArr })
      : this.getFor(criteria, true, { include: includesArr });
  }
}

module.exports = DoctorLeaveRepository;
