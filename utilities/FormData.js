const multer = require('multer');

class FormData {
  constructor(req) {
    this.req = req;
  }

  async getFormDataWithOptions(fieldname, options = {}) {
    options = App.helpers.cloneObj(
      {
        dest: App.helpers.config('paths.storage.temp.imports'),
      },
      options
    );
    // const upload = multer({storage : multer.memoryStorage()}).single(fieldname);
    const upload = multer({ dest: 
      // 'uploads/temp' 
      require('os').tmpdir() + "/"
    }).single(fieldname);

    return await new Promise((resolve, reject) => {
      upload(this.req, this.res, (err) => {
        if (err) {
          reject(null);
        }
        resolve(this.req);
      });
    });
  }
}

module.exports = FormData;
