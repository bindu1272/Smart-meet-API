const { ContactUs, User } = require("../models");
const BaseRepository = require("./BaseRepository");
const { Op } = require("sequelize");

class ContactUsRepository extends BaseRepository {
  constructor(req) {
    super();
    this.req = req;
    this.model = ContactUs;
  }
  async getAll(searchObj = {}, isPaginated = true) {
    let criteria = {};
    let includesArr = [];
    let checkObj = {};
    checkObj["$and"] = [];

    if ("query" in searchObj) {
      checkObj["$and"].push({
        name: {
          [Op.substring]: searchObj["query"],
        },
      });
    }

    includesArr.push({
      model: User,
      as: "user",
      required: true,
      attributes: ["name"],
    });
    criteria["where"] = { [Op.and]: checkObj["$and"] };
    criteria["include"] = includesArr;

    return isPaginated
      ? this.paginate(criteria, null, { include: includesArr })
      : this.getFor(criteria, true, { include: includesArr });
  }
  async deleteComment(inputId) {
    await this.model.destroy({
      where: {
        uuid: inputId,
      },
      
    });
    // await this.model.restore({
    //   where: {
    //     uuid: inputId,
    //   },
      
    // });
  }
  async get(inputId) {
    let criteria = {};
    let includesArr = [];
    let checkObj = {};
    checkObj["$and"] = [];
    checkObj["$and"].push({
      uuid: {
        [Op.eq]: inputId?.uuid,
      },
    });
    includesArr.push({
      model: User,
      as: "user",
      required: true,
      attributes: ["name"],
    });
    criteria["include"] = includesArr;
    criteria["where"] = { [Op.and]: checkObj["$and"] };
    return await this.getFor(criteria,false,{include : includesArr});
  }
}

module.exports = ContactUsRepository;
