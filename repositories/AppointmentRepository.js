const BaseRepository = require('./BaseRepository');
const {
  Appointment,
  User,
  Member,
  Hospital,
  AppointmentNote,
  DoctorDetail,
  Review,
} = require('../models');
const sequelize = require('sequelize');
const { Op } = sequelize;

class AppointmentRepository extends BaseRepository {
  constructor(req) {
    super();
    this.req = req;
    this.model = Appointment;
  }
  async search(searchObj, isPaginated = true) {
    let criteria = {};
    let includesArr = [];
    let checkObj = {};
    checkObj['$and'] = [];

    if ('order_by_slot' in searchObj && searchObj['order_by_slot']) {
      criteria['order'] = [['slot', 'ASC']];
      checkObj['$and'].push({
        slot: { [Op.gte]: App.lodash.get(searchObj, 'slot') },
      });
    } else {
      criteria['order'] = [['created_at', 'DESC']];
    }

    checkObj['$and'].push({
      status: {
        [Op.ne]: 0,
      },
    });

    if (searchObj['hospital']) {
      checkObj['$and'].push({
        hospital_id: searchObj['hospital'],
      });
    }

    if (
      searchObj['isDoctor'] ||
      searchObj['isManager'] ||
      searchObj['isDelegate']
    ) {
      checkObj['$and'].push({
        doctor_id: { [Op.in]: searchObj['doctor'] },
      });
    }

    checkObj['$and'].push(
      {
        date: { [Op.gte]: searchObj['from_date'] },
      },
      {
        date: { [Op.lte]: searchObj['to_date'] },
      }
    );

    if (searchObj['status']) {
      checkObj['$and'].push({
        status: searchObj['status'],
      });
    }

    if ('query' in searchObj) {
      checkObj['$and'].push({
        [Op.or]: [
          {
            appointment_id: {
              [Op.substring]: searchObj['query'],
            },
          },
          {
            '$appointment_member.name$': {
              [Op.substring]: searchObj['query'],
            },
          },
          {
            '$appointment_doctor.name$': { 
              [Op.substring]: searchObj['query'],
            }
            },
            {
            '$appointment_doctor.email$': { 
              [Op.substring]: searchObj['query'],
            },
          }
        ],
      });
    }

    includesArr.push(
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
      {
        model: Member,
        as: 'appointment_member',
        include: [
          {
            model: User,
            as: 'member_user',
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

  async patientSearch(searchObj, isPaginated = true) {
    let criteria = {};
    let includesArr = [];
    let checkObj = {};
    checkObj['$and'] = [];
    criteria['order'] = [['created_at', 'DESC']];

    if ('status' in searchObj && searchObj['status']) {
      checkObj['$and'].push({
        status: searchObj['status'],
      });
    } else {
      checkObj['$and'].push({
        status: {
          [Op.ne]: 0,
        },
      });
    }

    includesArr.push(
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
      {
        model: Hospital,
        as: 'appointment_hospital',
      },
      {
        model: AppointmentNote,
        as: 'appointment_notes',
      },
      {
        model: Review,
        as: 'appointment_ratings',
      },
      {
        model: Member,
        as: 'appointment_member',
        required: true,
        where: searchObj['member_uuid']
          ? {
              uuid: searchObj['member_uuid'],
            }
          : null,
        include: [
          {
            model: User,
            required: true,
            as: 'member_user',
            where: {
              id: App.lodash.get(searchObj, 'user_id'),
            },
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

  async getDoctorAppointmentStats(doctorIdArr, hospitalId) {
    return await this.getFor({
      group: ['doctor_id', 'status'],
      attributes: [
        'doctor_id',
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      where: {
        hospital_id: hospitalId,
        doctor_id: {
          [Op.in]: doctorIdArr,
        },
      },
    });
  }

  async getPatientAppointmentsStats(memberIdArr) {
    return await this.getFor({
      group: ['status'],
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      where: {
        member_id: {
          [Op.in]: memberIdArr,
        },
        status: {
          [Op.ne]: 0,
        },
      },
    });
  }

  async getAppointmentId() {
    let newAppointmentId = null;
    let appointment = await this.getFor(
      {
        order: [['id', 'DESC']],
      },
      false
    );

    if (App.lodash.get(appointment, 'appointment_id')) {
      newAppointmentId =
        parseInt(App.lodash.get(appointment, 'appointment_id')) + 1;
    } else {
      newAppointmentId = 1000;
    }

    return newAppointmentId;
  }
}

module.exports = AppointmentRepository;
