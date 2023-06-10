const BaseRepository = require('./BaseRepository');
const {
  AppointmentNote,
  Appointment,
  User,
  Member,
  DoctorDetail,
  Specialization,
  Hospital,
} = require('../models');
const { Op } = require('sequelize');

class AppointmentNoteRepository extends BaseRepository {
  constructor(req) {
    super();
    this.req = req;
    this.model = AppointmentNote;
  }

  async search(searchObj, isPaginated = true) {
    let criteria = {};
    let includesArr = [];
    let checkObj = {};
    checkObj['$and'] = [];

    includesArr.push(
      {
        model: User,
        as: 'note_updated_by',
      },
      {
        model: Appointment,
        as: 'note_appointment',
        required: true,
        where: {
          member_id: App.lodash.get(searchObj, 'member_id'),
          hospital_id: App.lodash.get(searchObj, 'hospital_id'),
        },
        include: [
          {
            model: User,
            as: 'appointment_doctor',
            include: [
              {
                model: DoctorDetail,
                as: 'doctor_detail',
              },
            ],
          },
        ],
      }
    );

    criteria['where'] = { [Op.and]: checkObj['$and'] };
    criteria['include'] = includesArr;
    return isPaginated
      ? this.paginate(criteria, null, { include: includesArr })
      : this.getFor(criteria, true, { include: includesArr });
  }

  async getMemberMedicalHistory(searchObj, isPaginated = true) {
    let criteria = {};
    let includesArr = [];
    let checkObj = {};
    checkObj['$and'] = [];

    if ('note_uuid' in searchObj) {
      checkObj['$and'].push({
        uuid: searchObj['note_uuid'],
      });
    }

    includesArr.push(
      {
        model: User,
        as: 'note_updated_by',
      },
      {
        model: Appointment,
        as: 'note_appointment',
        required: true,
        where: {
          member_id: App.lodash.get(searchObj, 'member_id'),
        },
        include: [
          {
            model: User,
            as: 'appointment_doctor',
            include: [
              {
                model: Specialization,
                as: 'user_specializations',
              },
            ],
          },
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
          {
            model: Hospital,
            as: 'appointment_hospital',
          },
        ],
      }
    );

    criteria['where'] = { [Op.and]: checkObj['$and'] };
    criteria['include'] = includesArr;
    return isPaginated
      ? this.paginate(criteria, null, { include: includesArr })
      : this.getFor(criteria, true, { include: includesArr });
  }
}

module.exports = AppointmentNoteRepository;
