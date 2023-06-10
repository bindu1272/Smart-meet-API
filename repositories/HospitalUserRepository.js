const BaseRepository = require('./BaseRepository');
const {
  HospitalUser,
  WorkingHour,
  Hospital,
  User,
  DoctorLeave,
  LeaveHour,
  Department,
  DoctorDetail,
  Specialization,
} = require('../models');
const { Op } = require('sequelize');

class HospitalUserRepository extends BaseRepository {
  constructor(req) {
    super();
    this.req = req;
    this.model = HospitalUser;
  }

  async getMonthWorkignHours(monthStart, monthEnd, doctor, hospital) {
    return await this.getFor(
      {
        where: {
          user_id: doctor.getData('id'),
          hospital_id: hospital.getData('id'),
        },
      },
      false,
      {
        include: [
          {
            model: WorkingHour,
            as: 'staff_working_hours',
            required: false,
          },
          {
            model: DoctorLeave,
            as: 'hospital_user_leaves',
            required: false,
            where: {
              [Op.and]: [
                {
                  date: {
                    [Op.gte]: monthStart,
                  },
                },
                {
                  date: {
                    [Op.lte]: monthEnd,
                  },
                },
              ],
            },
            include: [
              {
                model: LeaveHour,
                as: 'leave_hours',
              },
            ],
          },
        ],
      }
    );
  }

  async getDepartmentDoctor(departments = [], { hospital_id }) {
    return await this.getFor(
      {
        where: {
          hospital_id: hospital_id,
          role_id: App.helpers.config('settings.roles.doctor.value'),
        },
      },
      true,
      {
        include: [
          {
            required: true,
            model: Department,
            as: 'departments',
            through: {
              where: {
                department_id: App.lodash.map(departments, 'id'),
              },
            },
          },
        ],
      }
    );
  }

  async getDoctorList(searchObj, isPaginated = false) {
    let criteria = {};
    let includesArr = [];
    let checkObj = {};
    checkObj['$and'] = [];
    checkObj['$and'].push({
      role_id: App.helpers.config('settings.roles.doctor.value'),
    });

    if (('sort' in searchObj) & (searchObj['sort'] === 'rating')) {
      criteria['order'] = [
        [
          { model: User, as: 'hospital_user_user' },
          { model: DoctorDetail, as: 'doctor_detail' },
          'rating',
          'DESC',
        ],
      ];
    }

    let specialisationInclude = null;

    if (
      'specialisation_uuid' in searchObj &&
      searchObj['specialisation_uuid'] &&
      searchObj['specialisation_uuid'].split(',').length > 0
    ) {
      let specialisationArr = searchObj['specialisation_uuid'].split(',');
      specialisationInclude = {
        model: Specialization,
        as: 'user_specializations',
        where: { uuid: { [Op.in]: specialisationArr } },
      };
    } else {
      specialisationInclude = {
        model: Specialization,
        as: 'user_specializations',
      };
    }

    includesArr.push(
      {
        model: User,
        as: 'hospital_user_user',
        required: true,

        where:
          'gender' in searchObj &&
          searchObj['gender'] &&
          searchObj['gender'].split(',').length > 0
            ? {
                gender: { [Op.in]: searchObj['gender'].split(',') },
              }
            : null,

        include: [
          {
            model: DoctorDetail,
            required: true,
            as: 'doctor_detail',
          },
          specialisationInclude,
        ],
      },
      {
        model: Hospital,
        as: 'hospital_user_hospital',
      }
    );

    criteria['where'] = { [Op.and]: checkObj['$and'] };
    criteria['include'] = includesArr;
    return isPaginated
      ? this.paginate(criteria, null, { include: includesArr })
      : this.getFor(criteria, true, { include: includesArr });
  }
}

module.exports = HospitalUserRepository;
