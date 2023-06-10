const MediaService = require('../../../../services/MediaService');

module.exports = {
  upload: async (req, res) => {
    // let key = await new MediaService(req).upload();
    // res.success({ key, url: App.helpers.getImageUrl(key) });
    let result = await new MediaService(req).upload();
    // const finalResult = {
    //   key : key,
    //   url : App.lodash.get(result,'secure_url')
    // }
    res.success({url :result?.secure_url,result : result,key:`${result?.public_id}.${result?.format}`});
  },
  uploadVideo: async (req, res) => {
    // let key = await new MediaService(req).upload();
    // res.success({ key, url: App.helpers.getImageUrl(key) });
    let result = await new MediaService(req).uploadVideo();
    // const finalResult = {
    //   key : key,
    //   url : App.lodash.get(result,'secure_url')
    // }
    res.success({url :result?.secure_url,result : result,key:`${result?.public_id}.${result?.format}`});
  },
  uploadPDF: async (req, res) => {
    // let key = await new MediaService(req).upload();
    // res.success({ key, url: App.helpers.getImageUrl(key) });
    let result = await new MediaService(req).uploadPDF();
    // const finalResult = {
    //   key : key,
    //   url : App.lodash.get(result,'secure_url')
    // }
    res.success({url :result?.secure_url,result : result,key:`${result?.public_id}.${result?.format}`});
  },
  deleteImage: async (req, res) => {
    let result = await new MediaService(req).deleteImage(
      App.helpers.cloneObj(
        App.lodash.get(req, "params"),
        App.lodash.get(req, "body")
      )
    );
    res.success(result);
  },
  deletePDFFile: async (req, res) => {
    let result = await new MediaService(req).deletePDFFile(
      App.helpers.cloneObj(
        App.lodash.get(req, "params"),
        App.lodash.get(req, "body")
      )
    );
    res.success(result);
  },
};
