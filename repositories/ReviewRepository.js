const BaseRepository = require('./BaseRepository');
const { Review, Member, User, Appointment } = require('../models');
const sequelize = require('sequelize');
const { Op } = sequelize;

class ReviewRepository extends BaseRepository {
  constructor(req) {
    super();
    this.req = req;
    this.model = Review;
  }

  async search(searchObj = {}, isPaginated = true) {
    let criteria = {};
    let includesArr = [];
    let checkObj = {};
    checkObj['$and'] = [];
    criteria['order'] = [['created_at', 'DESC']];

    if ('owner_type' in searchObj && searchObj['owner_type'] === 'hospital') {
      checkObj['$and'].push({
        owner_type: 'hospital',
      });
      includesArr.push({
        model: Appointment,
        as: 'rating_hospital',
        where: {
          hospital_id: App.lodash.get(searchObj, 'hospital_id'),
        },
        include: [
          {
            model: Member,
            as: 'appointment_member',
            include: [
              {
                model: User,
                as: 'member_user',
              },
            ],
          },
        ],
      });
    }

    if (
      'owner_type' in searchObj &&
      searchObj['owner_type'] === 'appointment'
    ) {
      checkObj['$and'].push({
        owner_type: 'appointment',
      });

      includesArr.push({
        model: Appointment,
        as: 'rating_appointment',
        where: {
          doctor_id: App.lodash.get(searchObj, 'doctor_id'),
        },
        include: [
          {
            model: Member,
            as: 'appointment_member',
            include: [
              {
                model: User,
                as: 'member_user',
              },
            ],
          },
        ],
      });
    }

    criteria['where'] = { [Op.and]: checkObj['$and'] };
    criteria['include'] = includesArr;
    return isPaginated
      ? this.paginate(criteria, null, { include: includesArr })
      : this.getFor(criteria, true, { include: includesArr });
  }
}

module.exports = ReviewRepository;
