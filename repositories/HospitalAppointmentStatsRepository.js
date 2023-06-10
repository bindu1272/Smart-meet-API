const sequelize = require('sequelize');
const { Op } = sequelize;
const BaseRepository = require('./BaseRepository');
const { HospitalAppointmentStats } = require('../models');

class HospitalAppointmentStatsRepository extends BaseRepository {
  constructor(req) {
    super();
    this.req = req;
    this.model = HospitalAppointmentStats;
  }

  async search(searchObj, isPaginated = true) {
    let criteria = {};
    const startYear = App.moment().startOf('year').format('YYYY-MM-DD');
    const endYear = App.moment().endOf('year').format('YYYY-MM-DD');

    let checkObj = {};
    checkObj['$and'] = [];

    if ('hospital_id' in searchObj) {
      checkObj['$and'].push({
        hospital_id: searchObj['hospital_id'],
      });
    }

    if ('start_date' in searchObj && 'end_date' in searchObj) {
      checkObj['$and'].push(
        {
          date: { [Op.gte]: searchObj['start_date'] },
        },
        {
          date: { [Op.lte]: searchObj['end_date'] },
        }
      );
    }

    criteria['where'] = { [Op.and]: checkObj['$and'] };
    criteria['attributes'] = [
      [sequelize.fn('sum', sequelize.col('complete')), 'total_complete'],
      [sequelize.fn('sum', sequelize.col('cancelled')), 'total_cancelled'],
      [sequelize.fn('sum', sequelize.col('no_show')), 'total_noShow'],
    ];
    let appointmentTotals = await this.getFor(criteria);
    let monthlyStats = await this.findAll({
      where: searchObj['hospital_id']
        ? {
            hospital_id: searchObj['hospital_id'],
            [Op.and]: [
              {
                date: { [Op.gte]: startYear },
              },
              {
                date: { [Op.lte]: endYear },
              },
            ],
          }
        : {
            [Op.and]: [
              {
                date: { [Op.gte]: startYear },
              },
              {
                date: { [Op.lte]: endYear },
              },
            ],
          },
      attributes: [
        [sequelize.fn('SUM', sequelize.col('complete')), 'complete'],
        [sequelize.fn('SUM', sequelize.col('cancelled')), 'cancelled'],
        [sequelize.fn('SUM', sequelize.col('no_show')), 'noShow'],
        [sequelize.fn('MONTH', sequelize.col('date')), 'month'],
      ],
      group: [sequelize.fn('MONTH', sequelize.col('date'))],
    });

    let dayStats = await this.findAll({
      where: searchObj['hospital_id']
        ? {
            hospital_id: searchObj['hospital_id'],
            [Op.and]: [
              {
                date: { [Op.gte]: searchObj['start_date'] },
              },
              {
                date: { [Op.lte]: searchObj['end_date'] },
              },
            ],
          }
        : {
            [Op.and]: [
              {
                date: { [Op.gte]: searchObj['start_date'] },
              },
              {
                date: { [Op.lte]: searchObj['end_date'] },
              },
            ],
          },
      attributes: [
        [sequelize.fn('SUM', sequelize.col('complete')), 'complete'],
        [sequelize.fn('SUM', sequelize.col('cancelled')), 'cancelled'],
        [sequelize.fn('SUM', sequelize.col('no_show')), 'noShow'],
        [sequelize.fn('YEAR', sequelize.col('date')), 'year'],
        [sequelize.fn('MONTH', sequelize.col('date')), 'month'],
        [sequelize.fn('DAY', sequelize.col('date')), 'day'],
      ],
      group: [
        sequelize.fn('YEAR', sequelize.col('date')),
        sequelize.fn('MONTH', sequelize.col('date')),
        sequelize.fn('DAY', sequelize.col('date')),
      ],
    });

    return { appointmentTotals, monthlyStats, dayStats };
  }
}
module.exports = HospitalAppointmentStatsRepository;
