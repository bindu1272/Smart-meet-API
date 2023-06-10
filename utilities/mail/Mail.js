const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');
var AWS = require('aws-sdk');
require('dotenv').config();
var env = process.env || {};
// Set the region 
AWS.config.update({region:env.AWS__SES_REGION,"secretAccessKey":env.AWS__SES_SECRET_KEY,"accessKeyId":env.AWS__SES_CLIENT_ID});

require('dotenv').config();

class Mail {
  constructor() {
    this.transporter = sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }
  /**
   *
   * Sends email(s)
   * @param options = {
   *  to : string/Array, <required>
   *  from : string in format "Jimmy Fallon <jimmyfallon@gmail.com>" <optional>
   *  subject : string, <required>
   *  html : string, <required>
   * }
   */
  getParams(options){
    return {
      Destination: { /* required */
        CcAddresses: [
          /* more items */
        ],
        ToAddresses: [
          options.to
          /* more items */
        ]
      },
      Message: { /* required */
        Body: { /* required */
          Html: {
           Charset: "UTF-8",
           Data: options.html
          //  "HTML_FORMAT_BODY"
          
          },
          Text: {
           Charset: "UTF-8",
           Data: "TEXT_FORMAT_BODY"
          }
         },
         Subject: {
          Charset: 'UTF-8',
          Data: options.subject
          // 'Test email'
         }
        },
      Source: 'noreply@smartmeet.au', /* required */
      ReplyToAddresses: [
        /* more items */
      ],
    };
  }
//  send = async (options)=> {
//     // return this.transporter
//     //   .send(options)
//     //   .then((data) => {
//     //     // Mail.log(options.to, data);
//     //     console.log('suceess');
//     //     return data;
//     //   })
//     //   .catch((error) => {
//     //     console.log(
//     //       'error',
//     //       JSON.stringify(error),
//     //       JSON.stringify(error.response)
//     //     );
//     //     throw error;
//     //   });
// console.log("options1",options,env.AWS__SES_REGION,env.AWS__SES_CLIENT_ID,env.AWS__SES_SECRET_KEY,process.env.AWS__SES_CLIENT_ID);
// console.log("getParams",this.getParams(options));
// var sendPromise = new AWS.SES({apiVersion: '2010-12-01'}).sendEmail(this.getParams(options)).promise();
// console.log("sendPromise",sendPromise);
// await sendPromise.then(
//       function(data) {
//         console.log("successSES",data,data.MessageId);
//       }).catch(
//         function(err) {
//         console.log("error", err);
//       });

//   }


  send = async (options) => {
    try {
      const sendPromise = new AWS.SES({ apiVersion: '2010-12-01' }).sendEmail(this.getParams(options)).promise();
      const data = await sendPromise;
      console.log("successSES", data, data.MessageId);
      return data;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  }
  
 

  static log(emails, response) {
    console.log('Email Response: ', {
      to: emails,
      error: response instanceof Error ? true : false,
      results:
        response instanceof Error
          ? {
              message: response.message,
              response: JSON.stringify(response),
            }
          : {
              messageId: response.messageId,
              response: response.response,
            },
    });
  }
}

module.exports = Mail;
