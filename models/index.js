const { Sequelize } = require('sequelize');
require('dotenv').config();
var env = process.env || {};

const UserModel = require('./User');
const MemberModel = require('./Member');
const HospitalModel = require('./Hospital');
const HospitalUserModel = require('./HospitalUser');
const InvoiceModel = require('./Invoice');
const DoctorDetailModel = require('./DoctorDetail');
const SpecializationModel = require('./Specialization');
const DoctorLeaveModel = require('./DoctorLeave');
const AppointmentModel = require('./Appointment');
const AppointmentNoteModel = require('./AppointmentNote');
const ReviewModel = require('./Review');
const FaqModel = require('./Faq');
const WorkingHourModel = require('./WorkingHour');
const OtpModel = require('./Otp');
const InvitationLinkModel = require('./InvitationLink');
const DepartmentModel = require('./Department');
const LeaveHourModel = require('./LeaveHour');
const HospitalAppointmentStatsModel = require('./HospitalAppointmentStats');
const DoctorAppointmentStatsModel = require('./DoctorAppointmentStats');
const CityModel = require('./City');
const UserFavouriteModel = require('./UserFavourite');
const ContactUsModel = require("./ContactUs");
const AdsModel = require("./Ads");
const NotificationsModel = require("./Notifications");
const ScreenQuestions = require("./ScreenQuestions");
const AdditionalDetails = require("./AdditionalDetails");
const Claim = require("./Claim");
const ScreenQuestionsLink = require("./ScreenQuestionsLink");
const ClaimTypes = require("./ClaimTypes");
const mysql2 = require('mysql2');


const sequelize = new Sequelize(
  env.DB_DATABASE,
  env.DB_USERNAME,
  env.DB_PASSWORD,
  {
    host: env.DB_HOST,
    dialect: env.DB_CONNECTION,
    dialectModule : mysql2,
    operatorsAliases: false,
    logging: true,
    // timezone: env.DB_TIME_ZONE, // for writing to the db
    dialectOptions: {
      dateStrings: true, // disable mysql conversion
      typeCast: true,
      timezone: "local"
       // Overwrite the sequelize conversion, look at the code, currently only affects date and GEOMETRY, can be used
    },

    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

const db = {
  User: UserModel.init(sequelize, Sequelize),
  Member: MemberModel.init(sequelize, Sequelize),
  Hospital: HospitalModel.init(sequelize, Sequelize),
  HospitalUser: HospitalUserModel.init(sequelize, Sequelize),
  Invoice: InvoiceModel.init(sequelize, Sequelize),
  DoctorDetail: DoctorDetailModel.init(sequelize, Sequelize),
  Specialization: SpecializationModel.init(sequelize, Sequelize),
  DoctorLeave: DoctorLeaveModel.init(sequelize, Sequelize),
  Appointment: AppointmentModel.init(sequelize, Sequelize),
  AppointmentNote: AppointmentNoteModel.init(sequelize, Sequelize),
  Faq: FaqModel.init(sequelize, Sequelize),
  Review: ReviewModel.init(sequelize, Sequelize),
  WorkingHour: WorkingHourModel.init(sequelize, Sequelize),
  Otp: OtpModel.init(sequelize, Sequelize),
  InvitationLink: InvitationLinkModel.init(sequelize, Sequelize),
  Department: DepartmentModel.init(sequelize, Sequelize),
  LeaveHour: LeaveHourModel.init(sequelize, Sequelize),
  UserFavourite: UserFavouriteModel.init(sequelize, Sequelize),
  HospitalAppointmentStats: HospitalAppointmentStatsModel.init(
    sequelize,
    Sequelize
  ),
  DoctorAppointmentStats: DoctorAppointmentStatsModel.init(
    sequelize,
    Sequelize
  ),
  City: CityModel.init(sequelize, Sequelize),
  ContactUs : ContactUsModel.init(sequelize,Sequelize),
  Ads : AdsModel.init(sequelize,Sequelize),
  Notifications : NotificationsModel.init(sequelize,Sequelize),
  ScreenQuestions : ScreenQuestions.init(sequelize,Sequelize),
  AdditionalDetails : AdditionalDetails.init(sequelize,Sequelize),
  Claim : Claim.init(sequelize,Sequelize),
  ScreenQuestionsLink : ScreenQuestionsLink.init(sequelize,Sequelize),
  ClaimTypes : ClaimTypes.init(sequelize,Sequelize)
};

// Run `.associate` if it exists,
// ie create relationships in the ORM
Object.values(db)
  .filter((model) => typeof model.associate === 'function')
  .forEach((model) => {
    model.associate(db);
  });

// For initializing all the model hooks
Object.values(db)
  .filter((model) => {
    return typeof model.hooks === 'function';
  })
  .forEach((model) => {
    return model.hooks(db);
  });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
