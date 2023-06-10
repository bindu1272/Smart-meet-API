const BaseRepository = require('./BaseRepository');
const { DoctorDetail,User } = require('../models');
const { Op } = require("sequelize");

class DoctorDetailRepository extends BaseRepository {
  constructor(req) {
    super();
    this.req = req;
    this.model = DoctorDetail;
  }
  async restoreDoctor(inputId) {
    // await this.model.destroy({
    //   where: {
    //     uuid: inputId,
    //   },
      
    // });
     await this.model.restore({
      where: {
        uuid: inputId,
      },
    });
  }
  async getAllDoctors(isPaginated=false) {
    let criteria = {};
    let includesArr = [];
    let checkObj = {};
    checkObj["$and"] = [];
    
    includesArr.push({
      model: User,
      as: "doctor",
      required: true,
      // attributes: ["name"],
    });
    criteria["where"] = { [Op.and]: checkObj["$and"] };
    criteria["include"] = includesArr;

    return isPaginated
      ? this.paginate(criteria, null, { include: includesArr })
      : this.getFor(criteria, true, { include: includesArr });
  }
}

module.exports = DoctorDetailRepository;
