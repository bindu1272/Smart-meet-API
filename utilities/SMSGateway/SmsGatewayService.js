const axios = require('axios');

class SmsGatewayService {
  constructor() {
    this.headers = {
      authkey: App.env.MSG91_AUTHKEY,
      'Content-Type': 'application/json',
    };

    (this.sender = App.env.MSG91_SNEDER), (this.country = '91');
    this.sms = [];
    this.route = App.env.MSG91_ROUTE;
  }

  generateSms(message = null, mobilenumber = []) {
    if (App.lodash.isArray(mobilenumber) && !App.helpers.isEmpty(message))
      this.sms.push({
        message,
        to: mobilenumber,
      });
  }

  async getFormatedRequestData() {
    return {
      sender: this.sender,
      route: this.route,
      country: this.country,
      sms: this.sms,
    };
  }

  async SendSms() {
    let requestObj = await this.getFormatedRequestData();

    if (!App.helpers.env('TRIGGER_SMS')) {
      console.log(JSON.stringify(requestObj));
      return;
    }

    const instance = axios.create({
      baseURL: 'http://api.msg91.com/api/',
      timeout: 1000,
      headers: {
        authkey: App.env.MSG91_AUTHKEY,
        'content-type': 'application/json',
      },
    });

    instance
      .post('v2/sendsms?country=91', requestObj)
      .then((response) => {
        console.log(response.data);
        let mesgLog = '';
        this.sms.every(function (value) {
          mesgLog += `{${App.moment()}|${value.message}|${JSON.stringify(
            value.to
          )}}`;
          return true;
        });

        App.helpers.log(mesgLog, 'info', { filename: 'sms' });
      })
      .catch(function (error) {
        console.log('error', error);
        App.helpers.log('message', 'error', { filename: 'sms' });
      });
  }
}

module.exports = SmsGatewayService;
