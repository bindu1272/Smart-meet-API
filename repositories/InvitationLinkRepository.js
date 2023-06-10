const BaseRepository = require("./BaseRepository");
const { Op } = require("sequelize");
const { InvitationLink, sequelize } = require("../models");
const Mail = require("../utilities/mail/Mail");

class InvitationLinkRepository extends BaseRepository {
  constructor(req) {
    super();
    this.req = req;
    this.model = InvitationLink;
    this.mail = new Mail();
  }

  async getEmailObj(invite, email, owner_type, data, hospitalName) {
    let emailObj = {
      to: email,
      from: process.env.NO_REPLY_EMAIL,
    };

    let messageObj = null;
    let role = null;
    let url = null;
    let linkMessage = null;
    switch (owner_type) {
      case App.helpers.config(
        "settings.invite_link.owner_type.doctor_registration.value"
      ):
        messageObj = App.helpers.config("messages.email.doctor_invite");
        role = App.helpers.config("settings.roles.doctor");
        url = `${process.env.ADMIN_WEB_URL}/register-doctor/${invite.getData(
          "uuid"
        )}`;
        linkMessage = "Accept invite";
        break;
      case App.helpers.config(
        "settings.invite_link.owner_type.staff_registration.value"
      ):
        messageObj = App.helpers.config("messages.email.manager_invite");
        role = App.lodash.find(App.helpers.config("settings.roles"), [
          "value",
          App.lodash.get(data, "role_id"),
        ]);
        url = `${process.env.ADMIN_WEB_URL}/staff/${invite.getData("uuid")}`;
        linkMessage = "Accept invite";
        break;
      case App.helpers.config(
        "settings.invite_link.owner_type.hospital_agent_registration.value"
      ):
        messageObj = App.helpers.config("messages.email.hospital_agent_invite");
        role = App.helpers.config("settings.roles.hospitalAgent");
        url = `${
          process.env.ADMIN_WEB_URL
        }/register-hospital-agent/${invite.getData("uuid")}`;
        linkMessage = "Accept invite";
        break;

      case App.helpers.config(
        "settings.invite_link.owner_type.staff_forgot_password.value"
      ):
        messageObj = App.helpers.config("messages.email.staff_forgot_password");
        role = App.lodash.find(App.helpers.config("settings.roles"), [
          "value",
          App.lodash.get(data, "role_id"),
        ]);

        url =
          App.lodash.get(data, "type") === "website"
            ? `${process.env.WEB_URL}/reset-password/${invite.getData("uuid")}`
            : `${process.env.ADMIN_WEB_URL}/reset-password/${invite.getData(
                "uuid"
              )}`;

        linkMessage = "Change Password";
        break;
    }

    App.lodash.assign(messageObj, {
      subject: App.helpers.replaceMultiple(
        App.lodash.get(messageObj, "subject"),
        {
          "{hospitalName}": hospitalName,
        }
      ),
      message: App.helpers.replaceMultiple(
        App.lodash.get(messageObj, "message"),
        {
          "{hospitalName}": hospitalName,
          "{Role}": App.lodash.get(role, "name"),
        }
      ),
    });

    App.lodash.assign(emailObj, {
      subject: App.lodash.get(messageObj, "subject"),
      html:
        //  `<div><p>${App.lodash.get(
        //   messageObj,
        //   "message"
        // )}</p></div><a href=${url}>${linkMessage} </a>`
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
                              <p>${App.lodash.get(messageObj, "message")}</p>
                    </b><br /><br />
                    <a href=${url}>${linkMessage} </a>
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
   await this.mail.send(emailObj);
  }

  async sendInvitation({ email, owner, owner_type, data }, hospitalName = "H") {
    let inviteExists = await this.getFor({
      where: {
        email,
        owner_type,
        owner,
        status: App.helpers.config("settings.invite_link.status.created.value"),
      },
    });
    // if (inviteExists) {
    //   await this.update(
    //     {
    //       status: App.helpers.config(
    //         "settings.invite_link.status.expired.value"
    //       ),
    //     },
    //     {
    //       where: {
    //         id: {
    //           [Op.in]: App.lodash.map(inviteExists, "id"),
    //         },
    //       },
    //     }
    //   );
    // }

    const invite = await this.create({
      owner_type,
      email,
      owner,
      data,
      status: App.helpers.config("settings.invite_link.status.created.value"),
    });
   await this.getEmailObj(invite, email, owner_type, data, hospitalName);
    return invite;
  }

  async markLinkVerfied(id) {
    await this.update(
      {
        status: App.helpers.config(
          "settings.invite_link.status.verified.value"
        ),
      },
      {
        where: {
          id,
        },
      }
    );
  }
  async getDoctorInvitations(searchObj = {}, isPaginated = false) {
    let criteria = {};
    let includesArr = [];
    let checkObj = {};
    checkObj["$and"] = [];
    checkObj["$and"].push({
      owner_type: {
        [Op.eq]: searchObj["owner_type"],
      },
    });
    checkObj["$and"].push({
      status: {
        [Op.eq]: searchObj["status"],
      },
    });
    criteria["where"] = { [Op.and]: checkObj["$and"] };
    criteria["include"] = includesArr;

    return isPaginated
      ? this.paginate(criteria, null, { include: includesArr })
      : this.getFor(criteria, true, { include: includesArr });
  }
}

module.exports = InvitationLinkRepository;
