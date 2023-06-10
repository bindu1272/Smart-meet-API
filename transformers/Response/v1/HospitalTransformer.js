const BaseTransformer = require('./BaseTransformer');
const { Hospital } = require('../../../models');

class HospitalTransformer extends BaseTransformer {
  constructor(req, data, transformOptions = null) {
    super(req, data, transformOptions);
    this.model = Hospital;
    this.showFavourites = App.lodash.get(transformOptions, 'showFavourites');
  }

  async transform(hospital) {
    hospital = await hospital;

    let returnVal = App.helpers.cloneObj({
      id: hospital.getData('uuid'),
      name: hospital.getData('name'),
      logo: App.helpers.getImageUrl(hospital.getData('logo')),
      logo_url: App.helpers.getImageUrl(hospital.getData('logo')),
      slug: hospital.getData('slug'),
      created_at: hospital.getData('createdAt'),
      updated_at: hospital.getData('updatedAt'),
    });
    if (!App.lodash.get(this.transformOptions, 'showPartailData')) {
      returnVal = App.lodash.assign(returnVal, {
        description: hospital.getData('description'),
        contact_code: hospital.getData('contact_code'),
        contact_number: hospital.getData('contact_number'),
        address_1: hospital.getData('address_1'),
        address_2: hospital.getData('address_2'),
        suburb: hospital.getData('suburb'),
        state: hospital.getData('state'),
        country: hospital.getData('country'),
        doctor_count: hospital.getData('doctor_count'),
        brand_color: hospital.getData('brand_color'),
        fax_number: hospital.getData('fax_number'),
        sponsership_required: hospital.getData('sponsership_required'),
        website: hospital.getData('website'),
        billing_method: App.lodash.find(
          App.helpers.config('settings.billingMethods'),
          ['value', hospital.getData('billing_method')]
        ),
        billing_unit_amount: hospital.getData('billing_unit_amount'),
        verified: hospital.getData('verified'),
        pin_code: hospital.getData('pin_code'),
        reject_reason: hospital.getData('reject_reason'),
        contact_hours: hospital.getData('contact_hours'),
        banner_url: App.helpers.getImageUrl(hospital.getData('banner')),
        banner: App.helpers.getImageUrl(hospital.getData('banner')),
        rating: hospital.getData('rating'),
        logo_url: hospital.getData('logo_url'),
        rating_count: App.lodash.get(hospital, 'rating_count'),
        ex_medicare_location_id : App.lodash.get(hospital,'ex_medicare_location_id'),
        appointment_booking_duration: hospital.getData(
          'appointment_booking_duration'
        ),
        appointment_cancellation_duration: hospital.getData(
          'appointment_cancellation_duration'
        ),
      });
    }
    if (App.lodash.get(hospital, 'dataValues.distance')) {
      returnVal['distance'] = App.lodash.get(hospital, 'dataValues.distance');
    }

    if ('hospital_specs' in hospital) {
      returnVal['specialisations'] = await this.getSpecialisations(
        hospital.getData('hospital_specs')
      );
    }
    if ('hospital_working_hours' in hospital) {
      returnVal['working_hours'] = await this.getWorkingHours(
        hospital.getData('hospital_working_hours')
      );
    }

    if ('hospital_working_hours' in hospital) {
      returnVal['working_hours'] = await this.getWorkingHours(
        hospital.getData('hospital_working_hours')
      );
    }

    if ('hospital_city' in hospital) {
      returnVal['city'] = await this.getCity(hospital['hospital_city']);
    }

    if (
      this.showFavourites &&
      App.lodash.get(this.req, 'auth.isLoggedIn', false)
    ) {
      const patient = App.lodash.get(this.req, 'auth.user.detail');
      const isFavourite = await patient.getPatient_favourites({
        where: {
          owner_id: hospital.getData('id'),
          owner_type: 'Hospital',
        },
      });
      returnVal['is_favourite'] = isFavourite.length > 0 ? true : false;
    }

    if ('users' in hospital) {
      returnVal['admin'] = await this.getHospitalAdmin(
        App.lodash.head(hospital.getData('users'))
      );
    }
    return returnVal;
  }

  async getHospitalAdmin(user) {
    if (!user) {
      return null;
    }
    let transformer = require('./UserTransformer');
    return await new transformer(this.req, user, {}).init();
  }

  async getWorkingHours(workingHours) {
    let transformer = require('./WorkingHourTransformer');
    let promises = App.lodash.map(workingHours, (w) => {
      return new transformer(this.req, w, {}).init();
    });
    return await Promise.all(promises);
  }

  async getCity(city) {
    let transformer = require('./CityTransformer');
    return new transformer(this.req, city, {}).init();
  }

  async getSpecialisations(specialisations) {
    let transformer = require('./SpecialisationTransformer');
    let promises = App.lodash.map(specialisations, (s) => {
      return new transformer(this.req, s, {}).init();
    });
    return await Promise.all(promises);
  }
}

module.exports = HospitalTransformer;
