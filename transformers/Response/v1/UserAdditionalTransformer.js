const BaseTransformer = require('./BaseTransformer');
const { User } = require('../../../models');
const {
  AdditionalDetailsRepository,
  UserRepository
} = require("../../../repositories");

class UserAdditionalTransformer extends BaseTransformer {
  constructor(req, data, transformOptions = null) {
    super(req, data, transformOptions);
    this.model = User;
    this.additionalDetailsRepo = new AdditionalDetailsRepository(req);
    this.userRepo = new UserRepository(req);
    this.showFavourites = App.lodash.get(transformOptions, 'showFavourites');
  }

  async transform(user) {
    user = await user; 
    let returnVal = App.helpers.cloneObj({
      id: user.getData('uuid'),
      title: user.getData('title'),
      name: user.getData('name'),
      gender: user.getData('gender'),
      email: user.getData('email'),
      image: App.helpers.getImageUrl(user.getData('image')),
      contact_code: user.getData('contact_code'),
      contact_number: user.getData('contact_number'),
      is_active: user.getData('is_active'),
      created_at: user.getData('createdAt'),
      updated_at: user.getData('updatedAt'),
    });

    if (App.lodash.get(this.transformOptions, 'roles')) {
      let roles = App.helpers.config('settings.roles');
      returnVal['roles'] = App.lodash.map(
        App.lodash.get(this.transformOptions, 'roles'),
        (r) => {
          return App.lodash.find(roles, ['value', r]);
        }
      );
    }

    if ('user_specializations' in user && user["user_specializations"] != null) {
      returnVal['specialisations'] = await this.getSpecialisations(
        user.getData('user_specializations')
      );
    }
    if (user?.id) {
      const userDetails = await this.userRepo.getBy({
        id: App.lodash.get(user, "id"),
      });
      if(userDetails){
      const additionalDetails = await this.additionalDetailsRepo.getBy({
        user_id: App.lodash.get(userDetails, "id"),
      });
      returnVal["additionalDetails"] = await this.getAdditionalDetails(additionalDetails);
    }
    }
    if ('userDetails' in user && user['userDetails']) {
      returnVal = {
        ...returnVal,
        insurance_details: App.lodash.get(
          user['userDetails'],
          'insurance_details'
        ),
        address_details: App.lodash.get(user['userDetails'], 'address_details'),
        gender: App.lodash.get(user['userDetails'], 'gender'),
        dob: App.lodash.get(user['userDetails'], 'dob'),
        dob_formatted: App.lodash.get(user['userDetails'], 'dob')
          ? App.moment(
              App.lodash.get(user['userDetails'], 'dob'),
              'YYYY-MM-DD'
            ).format('MMM Do YY')
          : null,
        age: App.lodash.get(user['userDetails'], 'dob')
          ? App.moment().diff(
              App.lodash.get(user['userDetails'], 'dob'),
              'years',
              false
            )
          : null,
        blood_group: App.lodash.get(user['userDetails'], 'blood_group'),
        weight: App.lodash.get(user['userDetails'], 'weight'),
        height: App.lodash.get(user['userDetails'], 'height'),
      };
    }
    // if ('user_working_hours' in user) {
    //   returnVal['working_hours'] = await this.getWorkingHours(
    //     user.getData('user_working_hours')
    //   );
    // }

    if (App.lodash.get(this.transformOptions, 'showAppointmentStats')) {
      let AppointmentData = App.lodash.filter(
        App.lodash.get(this.transformOptions, 'appointmentStatus'),
        ['doctor_id', App.lodash.get(user, 'id')]
      );

      returnVal['appointment_status'] = App.lodash.map(
        AppointmentData,
        (ad) => {
          return {
            count: ad.getData('count'),
            status: App.lodash.find(
              App.helpers.config('settings.appointment_status'),
              ['value', App.lodash.get(ad, 'status')]
            ),
          };
        }
      );
    }

    if ('doctor_detail' in user && App.lodash.get(user, 'doctor_detail')) {
      returnVal['doctor_detail'] = await this.getDoctorDetail(
        user.getData('doctor_detail')
      );
    }

    if (
      this.showFavourites &&
      App.lodash.get(this.req, 'auth.isLoggedIn', false)
    ) {
      const patient = App.lodash.get(this.req, 'auth.user.detail');
      const isFavourite = await patient.getPatient_favourites({
        where: {
          owner_id: user.getData('id'),
          owner_type: 'Doctor',
        },
      });
      returnVal['is_favourite'] = isFavourite.length > 0 ? true : false;
    }

    return returnVal;
  }
  async getAdditionalDetails(additionalDetails) {
    if (!additionalDetails) {
      return null;
    }
    let transformer = require("./AdditionalDetailsTransformer");
    return await new transformer(this.req, additionalDetails, {}).init();
  }

  async getWorkingHours(workingHours) {
    let transformer = require('./WorkingHourTransformer');
    let promises = App.lodash.map(workingHours, (w) => {
      return new transformer(this.req, w, {}).init();
    });
    return await Promise.all(promises);
  }

  async getDoctorDetail(details) {
    let transformer = require('./DoctorDetailTransformer');
    return await new transformer(this.req, details, {}).init();
  }

  async getSpecialisations(specialisations) {
    let transformer = require('./SpecialisationTransformer');
    let promises = App.lodash.map(specialisations, (s) => {
      return new transformer(this.req, s, {}).init();
    });
    return await Promise.all(promises);
  }
}

module.exports = UserAdditionalTransformer;
