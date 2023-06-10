const RatingService = require('../../../../services/RatingService');
const BaseController = require('./BaseController');
const { ReviewTransformer } = require('../../../../transformers/Response/v1');

module.exports = {
  createRating: async (req, res) => {
    const data = await new RatingService(req).createRating(
      App.helpers.cloneObj(
        App.lodash.get(req, 'params'),
        App.lodash.get(req, 'body')
      )
    );
    res.noContent();
  },

  getHospitalReview: async (req, res) => {
    const data = await new RatingService(req).getHospitalReview(
      App.helpers.cloneObj(
        App.lodash.get(req, 'params'),
        App.lodash.get(req, 'body')
      )
    );
    const transformedData =
      await BaseController.getTransformedDataWithPagination(
        req,
        data,
        ReviewTransformer,
        {
          type: 'hospital',
        }
      );
    res.success(transformedData);
  },

  getDoctorReview: async (req, res) => {
    const data = await new RatingService(req).getDoctorReview(
      App.helpers.cloneObj(
        App.lodash.get(req, 'params'),
        App.lodash.get(req, 'body')
      )
    );

    const transformedData =
      await BaseController.getTransformedDataWithPagination(
        req,
        data,
        ReviewTransformer,
        {
          type: 'doctor',
        }
      );
    res.success(transformedData);
  },
};
