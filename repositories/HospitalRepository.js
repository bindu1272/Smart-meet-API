const BaseRepository = require('./BaseRepository');
const {
  Hospital,
  Specialization,
  WorkingHour,
  User,
  City,
} = require('../models');
const { Op } = require('sequelize');

class HospitalRepository extends BaseRepository {
  constructor(req) {
    super();
    this.req = req;
    this.model = Hospital;
  }

  async searchHospital(searchObj = {}, isPaginated = true) {
    let criteria = {};
    let includesArr = [];
    let checkObj = {};
    checkObj['$and'] = [];

    includesArr.push({
      model: City,
      as: 'hospital_city',
    });

    if ('rating' in searchObj) {
      criteria['order'] = [['rating', 'DESC']];
    } else {
      criteria['order'] = [['created_at', 'DESC']];
    }

    if ('uuid' in searchObj) {
      checkObj['$and'].push({
        uuid: searchObj['uuid'],
      });
    }

    if ('city_id' in searchObj) {
      checkObj['$and'].push(
        {
          city_id: searchObj['city_id'],
        },
        {
          verified: true,
        }
      );
    }

    if ('status' in searchObj) {
      checkObj['$and'].push({
        verified: searchObj['status'],
      });
    }

    if ('query' in searchObj) {
      checkObj['$and'].push({
        name: {
          [Op.substring]: searchObj['query'],
        },
      });
    }

    if ('hospital_ids' in searchObj && searchObj['hospital_ids']) {
      checkObj['$and'].push({
        id: {
          [Op.in]: searchObj['hospital_ids'],
        },
      });
    }

    if ('from_date' in searchObj && 'to_date' in searchObj) {
      checkObj['$and'].push(
        {
          created_at: {
            [Op.gte]: App.moment(searchObj['from_date'], 'YYYY-MM-DD')
              .startOf('day')
              .format('YYYY-MM-DD HH:mm:ss'),
          },
        },
        {
          created_at: {
            [Op.lte]: App.moment(searchObj['to_date'], 'YYYY-MM-DD')
              .endOf('day')
              .format('YYYY-MM-DD HH:mm:ss'),
          },
        }
      );
    }

    if ('slug' in searchObj) {
      checkObj['$and'].push({
        [Op.or]: [{ uuid: searchObj['slug'] }, { slug: searchObj['slug'] }],
      });
    }

    if (
      'specialisation_uuid' in searchObj &&
      searchObj['specialisation_uuid'] &&
      searchObj['specialisation_uuid'].split(',').length > 0
    ) {
      let specialisationArr = searchObj['specialisation_uuid'].split(',');

      includesArr.push({
        model: Specialization,
        as: 'hospital_specs',
        where: {
          uuid: { [Op.in]: specialisationArr },
        },
      });
    } else {
      includesArr.push({
        model: Specialization,
        as: 'hospital_specs',
      });
    }

    includesArr.push(
      {
        model: WorkingHour,
        as: 'hospital_working_hours',
      },
      {
        model: User,
        as: 'users',
        through: {
          where: { role_id: App.helpers.config('settings.roles.admin.value') },
        },
      }
    );

    criteria['where'] = { [Op.and]: checkObj['$and'] };
    criteria['include'] = includesArr;
    return isPaginated
      ? this.paginate(criteria, null, { include: includesArr })
      : this.getFor(criteria, true, { include: includesArr });
  }
}

module.exports = HospitalRepository;
