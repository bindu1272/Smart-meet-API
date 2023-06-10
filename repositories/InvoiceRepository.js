const BaseRepository = require('./BaseRepository');
const { Op } = require('sequelize');
const { Invoice, Hospital } = require('../models');
const { AppointmentRepository } = require('.');

class InvoiceRepository extends BaseRepository {
  constructor(req) {
    super();
    this.req = req;
    this.model = Invoice;
  }

  async search(searchObj = {}, isPaginated = true) {
    let criteria = {};
    let includesArr = [];
    let checkObj = {};
    checkObj['$and'] = [];
    criteria['order'] = [['created_at', 'DESC']];
    if ('status' in searchObj) {
      checkObj['$and'].push({
        status: searchObj['status'],
      });
    }

    let hospitalWhereObj = null;

    if ('name' in searchObj && searchObj['name']) {
      hospitalWhereObj = {
        name: { [Op.substring]: searchObj['name'] },
      };
    }

    if ('hospital_id' in searchObj && searchObj['hospital_id']) {
      hospitalWhereObj = {
        id: searchObj['hospital_id'],
      };
    }

    includesArr.push({
      model: Hospital,
      as: 'invoice_hospital',
      where: hospitalWhereObj,
    });

    criteria['where'] = { [Op.and]: checkObj['$and'] };
    criteria['include'] = includesArr;
    return isPaginated
      ? this.paginate(criteria, null, { include: includesArr })
      : this.getFor(criteria, true, { include: includesArr });
  }

  async getInvoiceNumber(hospital) {
    let count = await this.count({
      where: {
        hospital_id: App.lodash.get(hospital, 'id'),
      },
    });
    count = count + 1;
    let initial = App.lodash.upperCase(hospital.name.substring(0, 2));

    return `${initial}-${App.lodash.padStart(`${count}`, 4, '0')}`;
  }
}

module.exports = InvoiceRepository;
