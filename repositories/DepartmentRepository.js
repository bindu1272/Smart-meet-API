const BaseRepository = require('./BaseRepository');
const { Department } = require('../models');
const { Op } = require('sequelize');

class DepartmentRepository extends BaseRepository {
  constructor(req) {
    super();
    this.req = req;
    this.model = Department;
  }
  async deleteDepartment(inputId) {
    await this.model.destroy({
      where: {
        uuid: inputId,
      },
    });
     await this.model.restore({
      where: {
        uuid: inputId,
      },
    });
  }
}

module.exports = DepartmentRepository;
