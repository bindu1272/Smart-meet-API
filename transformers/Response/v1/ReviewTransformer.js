const BaseTransformer = require('./BaseTransformer');
const { Review } = require('../../../models');

class ReviewTransformer extends BaseTransformer {
  constructor(req, data, transformOptions = null) {
    super(req, data, transformOptions);
    this.model = Review;
  }

  async transform(review) {
    review = await review;
    let returnVal = {
      id: App.lodash.get(review, 'uuid'),
      rating: 2,
      comment: 'Test commentments',
      user:
        App.lodash.get(this.transformOptions, 'type') === 'hospital'
          ? await this.getUser(
              App.lodash.get(
                review,
                'rating_hospital.appointment_member.member_user'
              )
            )
          : await this.getUser(
              App.lodash.get(
                review,
                'rating_appointment.appointment_member.member_user'
              )
            ),
    };
    return returnVal;
  }

  async getUser(user) {
    const transformer = require('./UserTransformer');
    return await new transformer(this.req, user, {}).init();
  }
}

module.exports = ReviewTransformer;
