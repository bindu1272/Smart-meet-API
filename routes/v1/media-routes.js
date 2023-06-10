const MediaController = require('../../app/http/controllers/api/v1/MediaController');

module.exports = {
  [`POST media`]: {
    action: MediaController.upload,
    name: 'api.upload',
    middlewares: [],
  },
  [`POST media/video`]: {
    action: MediaController.uploadVideo,
    name: 'api.uploadVideo',
    middlewares: [],
  },
  [`POST media/pdf`]: {
    action: MediaController.uploadPDF,
    name: 'api.uploadPDF',
    middlewares: [],
  },
  [`DELETE media/:key`]: {
    action: MediaController.deleteImage,
    name: 'api.deleteImage',
    middlewares: [],
  },
  [`DELETE media/pdf/:key`]: {
    action: MediaController.deletePDFFile,
    name: 'api.deletePDFFile',
    middlewares: [],
  },

};
