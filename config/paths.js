module.exports = {
  images: {
    profile_pictures: {
      path: `uploads/images/profile_pictures`,
      type: 2,
    },
    documents: {
      type: 1,
      path: `uploads/images/documents`,
    },
    default: {
      image: `${App.paths.public}/images/sample_img.jpg`,
      avatar: `${App.paths.public}/images/sample_avatar`,
    },
  },

  storage: {
    temp: {
      imports: `${App.paths.storage}/imports`,
    },
    pdf: {
      imports: `${App.paths.storage}/imports`,
    },
    logs: {
      error: `${App.paths.storage}/logs/error.log`,
      combined: `${App.paths.storage}/logs/combined.log`,
      fcm: `${App.paths.storage}/logs/fcm.log`,
      sms: `${App.paths.storage}/logs/sms.log`,
    },
  },

  misc: {
    appLogo: {
      default: `${App.env.ADMIN_APP_URL}/assets/images/logo.png`,
    },
  },

  s3: {
    user: {
      path: `profile_pictures`,
      key: 1,
      suffix: 'img',
    },
  },
};
