const FormData = require("../utilities/FormData");
const path = require("path");
var cloudinary = require("cloudinary").v2;
require('dotenv').config({path:"../../.env"});
var env = process.env || {};

class MediaService {
  constructor(req) {
    this.req = req;
  }

  async upload() {
    cloudinary.config({
      cloud_name: env.CLOUDINARY_CLOUD_NAME,
      api_key: env.CLOUDINARY_API_KEY,
      api_secret: env.CLOUDINARY_API_SECRET,
    });
    let { file } = await new FormData(this.req).getFormDataWithOptions("file");
    const filePath = path.join(
      // App.paths.uploads,
      // "temp",
      require('os').tmpdir() + "/",
      `${App.lodash.get(file, "filename")}`
    );
    const cloudinaryResult = cloudinary.uploader
      // .upload(file?.originalname,{public_id:file?.path,resource_type: "video",}).then(result=>{
      .upload(filePath, { public_id: file?.filename })
      .then((result) => {
        return result;
      })
      .catch((err) => console.log("errMedia", err));
    // .upload(filePath,{public_id:file?.filename,context}).then(result=>result)
    // let bucket = await gc.bucket(App.env.BUCKET_NAME);
    // let key = App.helpers.getImageName(App.lodash.get(file, 'mimetype'));
    // await bucket.upload(
    //   path.join(
    //     App.paths.uploads,
    //     'temp',
    //     `${App.lodash.get(file, 'filename')}`
    //   ),
    //   {
    //     destination: key,
    //   }
    // );
    // App.helpers.removeFile(
    //   path.join(
    //     App.paths.uploads,
    //     'temp',
    //     `${App.lodash.get(file, 'filename')}`
    //   )
    // );
    return cloudinaryResult;
  }
  async uploadVideo() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    let { file } = await new FormData(this.req).getFormDataWithOptions("file");
    const gc = new Storage({
      keyFilename: path.join(App.paths.root, "config", "bucketService.json"),
      projectId: App.env.GCP_PROJECT_ID,
    });
    // const context = {title:"tree",description:"green color",name:"tea tree",age:"20",custom1:"custom"};
    const filePath = path.join(
      // App.paths.uploads,
      // "temp",
      require('os').tmpdir() + "/",
      `${App.lodash.get(file, "filename")}`
    );
    const cloudinaryResult = cloudinary.uploader
      // .upload(file?.originalname,{public_id:file?.path,resource_type: "video",}).then(result=>{
      .upload(filePath, { public_id: file?.filename, resource_type: "video" })
      .then((result) => {
        return result;
      })
      .catch((err) => console.log("err", err));
    return cloudinaryResult;
  }
  async uploadPDF() {
    cloudinary.config({
      cloud_name: env.CLOUDINARY_CLOUD_NAME,
      api_key: env.CLOUDINARY_API_KEY,
      api_secret: env.CLOUDINARY_API_SECRET,
    });
    let { file } = await new FormData(this.req).getFormDataWithOptions("file");
    const filePath = path.join(
      // App.paths.uploads,
      // "temp",
      require('os').tmpdir() + "/",
      `${App.lodash.get(file, "filename")}`
    );
    const cloudinaryResult = cloudinary.uploader
      .upload(filePath, { public_id: file?.filename, resource_type: "image" })
      .then((result) => {
        return result;
      })
      .catch((err) => console.log("err", err));
    return cloudinaryResult;
  }
  async deleteImage(inputs){
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
   const result =  cloudinary.uploader.destroy(inputs?.key,{resource_type: "image"}).then(
    res=>res
   ).catch((err)=>{
    console.log(err);
   });
   return result;
  }
  async deletePDFFile(inputs){
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
   const result =  cloudinary.uploader.destroy(inputs?.key,{resource_type: "image"}).then(
    res=>res
   ).catch((err)=>{
    console.log(err);
   });
   return result;
  }
}

module.exports = MediaService;
