const {
  AppointmentRepository,
  HospitalRepository,
  ReviewRepository,
  DoctorDetailRepository,
  UserRepository,
} = require('../repositories');
const AppointmentValidator = require('../validators/AppointmentValidator');
const GenericError = require('../errors/GenericError');
const { Appointment } = require('../models');
const sequelize = require('sequelize');

class RatingService {
  constructor(req) {
    this.req = req;
    this.user = App.lodash.get(req, 'user.detail');
    this.userRepo = new UserRepository(req);
    this.hospitalRepo = new HospitalRepository(req);
    this.appointmentValidator = new AppointmentValidator(req);
    this.reviewRepo = new ReviewRepository(req);
    this.appointmentRepo = new AppointmentRepository(req);
    this.doctorDetailRepo = new DoctorDetailRepository(req);
  }

  async updateHospitalRating(hospitalId) {
    let ratings = await this.reviewRepo.rawQuery(
      App.helpers.replaceMultiple(
        App.helpers.config('rawQuery.defaults.hospital_ratings'),
        {
          '{hospital_id}': hospitalId,
        }
      )
    );
    ratings = App.lodash.head(ratings);
    let totalRating = App.lodash.get(ratings, 'total_rating');
    let totalCount = App.lodash.get(ratings, 'total_count');
    let averageRating = App.lodash.round(totalRating / totalCount, 2);

    await this.hospitalRepo.update(
      {
        rating: averageRating,
        rating_count: totalCount,
      },
      {
        where: {
          id: hospitalId,
        },
      }
    );
  }

  async updateDoctorRating(doctorId) {
    let ratings = await this.reviewRepo.rawQuery(
      App.helpers.replaceMultiple(
        App.helpers.config('rawQuery.defaults.doctor_ratings'),
        {
          '{doctor_id}': doctorId,
        }
      )
    );
    ratings = App.lodash.head(ratings);
    let totalRating = App.lodash.get(ratings, 'total_rating');
    let totalCount = App.lodash.get(ratings, 'total_count');
    let averageRating = App.lodash.round(totalRating / totalCount, 2);

    await this.doctorDetailRepo.update(
      {
        rating: averageRating,
        rating_count: totalCount,
      },
      {
        where: {
          user_id: doctorId,
        },
      }
    );
  }

  async createRating(inputs) {
    await this.appointmentValidator.validate(inputs, 'create-rating');
    let appointment = await this.appointmentRepo.getBy({
      uuid: App.lodash.get(inputs, 'uuid'),
    });

    let reviewExists = await appointment.getAppointment_ratings();

    if (reviewExists.length > 0) {
      throw new GenericError(
        App.helpers.config('messages.errorMessages.rating.ratingExists')
      );
    }

    let hospital = await this.hospitalRepo.getBy({
      id: App.lodash.get(appointment, 'hospital_id'),
    });

    let appointmentReview = await this.reviewRepo.create({
      rating: App.lodash.get(inputs, 'appointment_rating'),
      comment: App.lodash.get(inputs, 'appointment_comment'),
    });
    let hospitalReview = await this.reviewRepo.create({
      rating: App.lodash.get(inputs, 'hospital_rating'),
      comment: App.lodash.get(inputs, 'hospital_comment'),
    });
    await appointment.addAppointment_ratings(appointmentReview);
    await appointment.addHospital_ratings(hospitalReview);

    await this.updateDoctorRating(App.lodash.get(appointment, 'doctor_id'));
    await this.updateHospitalRating(App.lodash.get(appointment, 'hospital_id'));
  }

  async getHospitalReview(inputs) {
    await this.appointmentValidator.validate(inputs, 'hospital-reviews');
    let hospital = await this.hospitalRepo.getBy({
      uuid: App.lodash.get(inputs, 'uuid'),
    });

    return await this.reviewRepo.search({
      owner_type: 'hospital',
      hospital_id: hospital.getData('id'),
    });
  }

  async getDoctorReview(inputs) {
    await this.appointmentValidator.validate(inputs, 'doctor-reviews');
    let user = await this.userRepo.getBy({
      uuid: App.lodash.get(inputs, 'uuid'),
    });

    return await this.reviewRepo.search({
      owner_type: 'appointment',
      doctor_id: user.getData('id'),
    });
  }
}

module.exports = RatingService;
