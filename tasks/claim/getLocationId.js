const axios = require("axios");

module.exports =async(locationName,oauthToken)=>{
    const instance = axios.create({
      baseURL: App.env.CLAIMS_SERVER_URL,
      timeout: 1000,
      headers: {
        authorization: `Bearer ${oauthToken?.access_token}`,
        "content-type": "application/json",
        accept: "application/json",
      },
    });

    const result = await instance
      .post(
        `v2/locations`,
        {"name":locationName}
      )
      .then((response) => {
          return response?.data?.id;
      })
      .catch(function (error) {
        console.log(
          "error",error,
          error?.response?.data?.message,
          error?.response?.data?.status
        );
        // return App.helpers.log('message', 'error', { filename: 'sms' });
        return error?.response?.data;
      });
      return result;
  }