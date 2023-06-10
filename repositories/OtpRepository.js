const BaseRepository = require('./BaseRepository');
const { Op } = require('sequelize');
const { Otp } = require('../models');
const GenericError = require('../errors/GenericError');
const Mail = require('../utilities/mail/Mail');

class OtpRepository extends BaseRepository {
  constructor(req) {
    super();
    this.req = req;
    this.model = Otp;
    this.mail = new Mail();
  }

  async mailOtp(otp) {
    try{
    let emailObj = {
      to: App.lodash.get(otp, 'owner'),
      from: process.env.NO_REPLY_EMAIL,
    };

    let messageObj = null;

    switch (App.lodash.get(otp, 'owner_type')) {
      case App.helpers.config(
        'settings.otp.owner_type.hospital_registration.value'
      ):
        messageObj = App.helpers.config(
          'messages.email.hospital_verification_otp'
        );
        break;
      case App.helpers.config(
        'settings.otp.owner_type.create_appointment.value'
      ):
        messageObj = App.helpers.config(
          'messages.email.create_appointment_otp'
        );
        break;
      case App.helpers.config(
        'settings.otp.owner_type.patient_registration.value'
      ):
        messageObj = App.helpers.config(
          'messages.email.patient_registration_otp'
        );
        break;
    }

    const newMessageObj = {
      subject: App.lodash.get(messageObj, 'subject'),
      message: App.helpers.replaceMultiple(
        App.lodash.get(messageObj, 'message'),
        {
          '{otp}': otp.getData('otp'),
        }
      ),
    };

    App.lodash.assign(emailObj, {
      subject: App.lodash.get(newMessageObj, 'subject'),
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
                                    <p>${App.lodash.get(newMessageObj, 'message')}</p>
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
      </html>`
      ,
    });

    return await this.mail.send(emailObj);
  }catch(error){
    console.log("catcherror",error);
  }
  }

  async sendOtp({ media_type, owner, owner_type, owner_id }) {
    let whereObj = {
      owner_type,
      owner,
      status: App.helpers.config('settings.otp.status.created.value'),
    };

    if (owner_id) {
      whereObj['owner_id'] = owner_id;
    }
    let otpExists = await this.getFor({
      where: whereObj,
    });

    if (otpExists) {
      await this.update(
        {
          status: App.helpers.config('settings.otp.status.expired.value'),
        },
        {
          where: {
            id: {
              [Op.in]: App.lodash.map(otpExists, 'id'),
            },
          },
        }
      );
    }
    let createObj = {
      otp: App.helpers.getOTP(),
      owner_type,
      media_type,
      owner,
      status: App.helpers.config('settings.otp.status.created.value'),
    };

    if (owner_id) {
      createObj['owner_id'] = owner_id;
    }

    const otp = await this.create(createObj);
    await this.mailOtp(otp);
    return otp;
  }

  async validateOtp(uuid, value) {
    let message = null;
    const otp = await this.getBy({
      uuid,
      status: App.helpers.config('settings.otp.status.created.value'),
    });

    if (!otp || App.lodash.get(otp, 'otp') != value) {
      message = App.helpers.config('messages.errorMessages.otp.invalidOtp');
    }

    if (!message) {
      await this.update(
        {
          status: App.helpers.config('settings.otp.status.verified.value'),
        },
        {
          where: {
            uuid,
          },
        }
      );
    }
    return { message, otp };
  }

  async resendOtp(uuid) {
    const oldOtp = await this.getBy({
      uuid,
      status: App.helpers.config('settings.otp.status.created.value'),
    });
    if (!oldOtp) {
      throw new GenericError('Invalid Otp uuid selected');
    }

    const newOtp = await this.create({
      otp: App.helpers.getOTP(),
      media_type: oldOtp.getData('media_type'),
      owner_id: oldOtp.getData('owner_id'),
      owner: oldOtp.getData('owner'),
      owner_type: oldOtp.getData('owner_type'),
    });
    await this.mailOtp(newOtp);
    await this.update(
      {
        status: App.helpers.config('settings.otp.status.expired.value'),
      },
      {
        where: {
          uuid,
        },
      }
    );
    return newOtp;
  }

  async appointmentConfirmationMail(user_mail,user_name,doctor_name,hospital_name,appointment_date,appointment_time){
    let emailObj = {
      to: user_mail,
      from: process.env.NO_REPLY_EMAIL,
    };

    let messageObj = {
      subject : "Appointment Schedule Confirmation "
    }
    const newMessageObj = {
      subject: "Appointment Booked Successfully",
      user_name : user_name,
      doctor_name : doctor_name,
      hospital_name : hospital_name,
      appointment_date : appointment_date,
      appointment_time : appointment_time,
    };
    App.lodash.assign(emailObj, {
      subject: App.lodash.get(newMessageObj, 'subject'),
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
                                                                  font-size: 32px;
                                                                  font-weight: 400;
                                                                  line-height: 40px;
                                                                  letter-spacing: 0px;
                                                                  text-align: left;
                                                                  color : green;
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
                                      margin-bottom: 10px;
                                    ">
                                    <p><b>${App.lodash.get(newMessageObj, 'appointment_date')}</b> , Time : <b>${App.lodash.get(newMessageObj, 'appointment_time')}</b> </p>
                          </b><br />
                          <p> for <b>${App.lodash.get(newMessageObj, 'user_name')}</b> with <b>${App.lodash.get(newMessageObj,"doctor_name")}</b> </p>
                          <br/>
                          Hospital : 
                                          <b>${App.lodash.get(
                                            newMessageObj,
                                            "hospital_name"
                                          )}
                                          </b>

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
      </html>`
      ,
    });

    return await this.mail.send(emailObj);

  }
}

module.exports = OtpRepository;
