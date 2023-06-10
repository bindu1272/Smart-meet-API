const { Op } = require("sequelize");
const BaseRepository = require("./BaseRepository");
const {
  User,
  Hospital,
  Specialization,
  DoctorDetail,
  Department,
  HospitalUser,
  WorkingHour,
} = require("../models");
const Mail = require("../utilities/mail/Mail");

class UserRepository extends BaseRepository {
  constructor(req) {
    super();
    this.req = req;
    this.model = User;
    this.mail = new Mail();
  }

  async searchDoctor(searchObj, isPaginated = true) {
    let criteria = {};
    let includesArr = [];
    let checkObj = {};
    checkObj["$and"] = [];
    if ("user_ids" in searchObj && searchObj["user_ids"]) {
      checkObj["$and"].push({
        id: {
          [Op.in]: searchObj["user_ids"],
        },
      });
    }

    if ("hospital" in searchObj) {
      let whereThrough = {
        hospital_id: App.lodash.get(searchObj, "hospital"),
        role_id: App.helpers.config("settings.roles.doctor.value"),
      };

      if ("hospital_user_ids" in searchObj) {
        whereThrough = {
          ...whereThrough,
          user_id: {
            [Op.in]: searchObj["hospital_user_ids"],
          },
        };
      }

      let specialisationInclude = App.lodash.get(
        searchObj,
        "specialisation_uuid"
      )
        ? {
            model: Specialization,
            as: "user_specializations",
            where: {
              uuid: App.lodash.get(searchObj, "specialisation_uuid"),
            },
          }
        : {
            model: Specialization,
            as: "user_specializations",
          };
      includesArr.push(
        {
          model: Hospital,
          as: "hospitals",
          required: true,
          through: {
            where: whereThrough,
          },
        },
        specialisationInclude,
        {
          model: DoctorDetail,
          as: "doctor_detail",
        }
      );
    }

    if ("user_uuid" in searchObj) {
      checkObj["$and"].push({
        uuid: App.lodash.get(searchObj, "user_uuid"),
      });
      includesArr.push(
        {
          model: Specialization,
          as: "user_specializations",
        },
        {
          model: DoctorDetail,
          as: "doctor_detail",
        }
      );
    }

    if ("all_Hospital" in searchObj) {
      includesArr.push({
        model: Hospital,
        as: "hospitals",
        through: {
          role_id: App.helpers.config("settings.roles.doctor.value"),
        },
      });
    }

    criteria["where"] = { [Op.and]: checkObj["$and"] };
    criteria["include"] = includesArr;
    return isPaginated
      ? this.paginate(criteria, null, { include: includesArr })
      : this.getFor(criteria, true, { include: includesArr });
  }

  async searchStaff(searchObj, isPaginated = true) {
    let criteria = {};
    let includesArr = [];
    let checkObj = {};
    checkObj["$and"] = [];
    if (
      App.helpers.config("settings.roles.manager.value") ===
      App.lodash.get(searchObj, "role_id")
    ) {
      includesArr.push({
        model: Hospital,
        as: "hospitals",
        required: true,
        through: {
          where: {
            hospital_id: App.lodash.get(searchObj, "hospital_id"),
            role_id: App.lodash.get(searchObj, "role_id"),
            user_id: {
              [Op.in]: App.lodash.get(searchObj, "hospital_user_id"),
            },
          },
        },
      });
    } else if (
      App.helpers.config("settings.roles.delegate.value") ===
      App.lodash.get(searchObj, "role_id")
    ) {
      console.log("====>enter here");
      checkObj["$and"].push({
        id: {
          [Op.in]: searchObj["user_ids"],
        },
      });
    } else {
      includesArr.push({
        model: Hospital,
        as: "hospitals",
        required: true,
        through: {
          where: {
            hospital_id: App.lodash.get(searchObj, "hospital_id"),
            role_id: App.lodash.get(searchObj, "role_id"),
          },
        },
      });
    }

    criteria["where"] = { [Op.and]: checkObj["$and"] };
    criteria["include"] = includesArr;
    return isPaginated
      ? this.paginate(criteria, null, { include: includesArr })
      : this.getFor(criteria, true, { include: includesArr });
  }

  async sendUserCredientials(email, password) {
    let emailObj = {
      to: email,
      from: process.env.NO_REPLY_EMAIL,
    };

    App.lodash.assign(emailObj, {
      subject: "Thank For using Smartmeet",
      html:
        `<!DOCTYPE html>
      <html>
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <meta charset="UTF-8" />
      <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
      
      <head>
        <title>Smart Meet</title>
      
        <link rel="stylesheet" href="https://www.studytorch.com/static/css/main.b155fc00.css" />
      </head>
      
      <body style="">
        <div style="margin-inline: 40%;">
          <table style="width: 400px" cellpadding="0" cellspacing="0">
            <tbody>
              <tr style="background: #e4ecf7">
                <td align="Left" valign="top" style="padding: 40px 24px 32px 24px" colspan="3">
                </td>
              </tr>
      
              <tr style="display: flex">
                <td style="width: 24px; display: inline-block" bgcolor="#E4ECF7"></td>
                <td bgcolor="#E4ECF7">
                  <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word"
                    arcsize="4%" style="width: 352px; display: block; height: 100%" strokecolor="#ffffff" fillcolor="false">
                    <div style="
                                    background-color: #fff;
                                    box-shadow: 0px 0px 1px rgba(12, 26, 75, 0.1),
                                      0px 20px 24px rgba(20, 37, 63, 0.06);
                                    border-radius: 8px;
                                    padding: 24px;
                                  ">
                      <img src="https://d1hkm3rvui4sho.cloudfront.net/studytorch/images/email/starts.png" title="Tidy Logo" width="64" />
                      <h1 style="
                                                                  margin: 24px 0;
                                                                  font-family: 'Lucida Sans', 'Lucida Sans Regular',
                                                                    'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana,
                                                                    sans-serif;
                                                                  font-size: 40px;
                                                                  font-weight: 700;
                                                                  line-height: 40px;
                                                                  letter-spacing: 0px;
                                                                  text-align: left;
                                                                ">
                                                                ${App.lodash.get(
                                                                  messageObj,
                                                                  "subject"
                                                                )} </h1>
                      <p style="
                                      font-family: 'Lucida Sans', 'Lucida Sans Regular',
                                        'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana,
                                        sans-serif;
                                      font-size: 16px;
                                      font-weight: 400;
                                      line-height: 22px;
                                      letter-spacing: 0em;
                                      text-align: left;
                                      margin-bottom: 20px;
                                    ">
                                    <p>
                                You have successfully signup on smartmeet please use below credientials to see you appointment status </p>
                                <div>
                                <b>Email</b> : ${email} <br/>
                                <b>password</b>: ${password}
                                </div>
                          </b><br /><br />
                      </p>
                      <!-- <a href="https://studyTorch.com" style="text-align: center;"><img src="https://d1hkm3rvui4sho.cloudfront.net/studytorch/images/email/button.png"
                          style="width: 100%;" /></a>
                    </div> -->
                  </v:roundrect>
                </td>
                <td style="width: 24px; display: inline-block" bgcolor="#E4ECF7"></td>
              </tr>
              <tr style="background: #e4ecf7; display: flex">
                <td style="width: 24px; display: inline-block" bgcolor="#e4ecf7"></td>
                <td>&nbsp;</td>
                <td style="width: 24px; display: inline-block" bgcolor="#e4ecf7"></td>
              </tr>
              <tr style="background: #f3f3f3; display: flex">
                <td style="width: 24px; display: inline-block" bgcolor="#f3f3f3"></td>
                <td>&nbsp;</td>
                <td style="width: 24px; display: inline-block" bgcolor="#f3f3f3"></td>
              </tr>
              <tr style="background: #f3f3f3; display: flex">
                <td style="width: 24px; display: inline-block" bgcolor="#f3f3f3"></td>
                <td>&nbsp;</td>
                <td style="width: 24px; display: inline-block" bgcolor="#f3f3f3"></td>
              </tr>
              <tr style="background: #f3f3f3; display: flex">
                <td style="width: 24px; display: inline-block" bgcolor="#f3f3f3"></td>
                <td>
                  <p style="
                                  font-family: 'Lucida Sans', 'Lucida Sans Regular',
                                    'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana,
                                    sans-serif;
                                  font-size: 12px;
                                  font-weight: 400;
                                  line-height: 20px;
                                  letter-spacing: 0em;
                                  text-align: left;
                                ">
                    This message was sent to noreply@smartmeet.com. If you don't want to
                    receive these emails from us in the future, you can edit your
                    profile .
                  </p>
                </td>
                <td style="width: 24px; display: inline-block" bgcolor="#f3f3f3"></td>
              </tr>
              <tr style="background: #f3f3f3; display: flex">
                <td style="width: 24px; display: inline-block" bgcolor="#f3f3f3"></td>
                <td>&nbsp;</td>
                <td style="width: 24px; display: inline-block" bgcolor="#f3f3f3"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </body>
      </html>`,
    });

    this.mail.send(emailObj);
  }
  async deleteDoctor(inputId) {
    await this.model.destroy({
      where: {
        uuid: inputId,
      },
    });
  }
  async restoreDoctor(inputId) {
    await this.model.restore({
      where: {
        deletedAt: !null,
      },
    });
  }
  async deleteHospitalAdmin(inputId) {
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

module.exports = UserRepository;
