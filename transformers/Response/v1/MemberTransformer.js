const BaseTransformer = require('./BaseTransformer');
const { Member } = require('../../../models');
const {
  UserRepository,
  AdditionalDetailsRepository
} = require('../../../repositories');


class MemberTransformer extends BaseTransformer {
  constructor(req, data, transformOptions = null) {
    super(req, data, transformOptions);
    this.model = Member;
    this.userRepo = new UserRepository();
    this.additionalDetailsRepo = new AdditionalDetailsRepository();
  }

  async transform(member) {
    member = await member;
    const is_primary = App.lodash.get(member, 'is_primary');
    let returnVal = {
      id: App.lodash.get(member, 'uuid'),
      name: is_primary
        ? App.lodash.get(member, 'member_user?.name')
        : App.lodash.get(member, 'name'),
      insurance_details: App.lodash.get(member, 'insurance_details'),
      address_details: App.lodash.get(member, 'address_details'),
      gender: App.lodash.get(member, 'gender'),
      relation: App.lodash.get(member, 'relation'),
      contact_code: App.lodash.get(member, 'contact_code'),
      contact_number: App.lodash.get(member, 'contact_number'),
      email: App.lodash.get(member, 'member_user.email'),
      is_primary: App.lodash.get(member, 'is_primary'),
      dob: App.lodash.get(member, 'dob'),
      dob_formatted: App.lodash.get(member, 'dob')
        ? App.moment(App.lodash.get(member, 'dob'), 'YYYY-MM-DD').format(
            'MMM Do YY'
          )
        : null,
      age: App.lodash.get(member, 'dob')
        ? App.moment().diff(App.lodash.get(member, 'dob'), 'years', false)
        : null,
      blood_group: App.lodash.get(member, 'blood_group'),
      weight: App.lodash.get(member, 'weight'),
      height: App.lodash.get(member, 'height'),
    };
    if ('user_id' in member) {
      const user = await this.userRepo.getBy({
          id : App.lodash.get(member, "user_id")
        }
      )
      returnVal['user'] = await this.getUser(user);
      const userAdditionalDetails = await this.additionalDetailsRepo.getBy({
        user_id : App.lodash.get(member, "user_id")
      });
      returnVal['user_additional_details'] = await this.getUserAdditionalDetails(userAdditionalDetails);
    }
    return returnVal;
  }
  async getUser(user) {
    if (!user) {
      return null;
    }
    let transformer = require('./UserTransformer');
    return await new transformer(this.req, user, {}).init();
  }
  async getUserAdditionalDetails(userAdditionalDetails) {
    if (!userAdditionalDetails) {
      return null;
    }
    let transformer = require('./AdditionalDetailsTransformer');
    return await new transformer(this.req, userAdditionalDetails, {}).init();
  }
}

module.exports = MemberTransformer;
