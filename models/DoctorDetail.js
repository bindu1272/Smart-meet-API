const { intval } = require('locutus/php/var');
const BaseModel = require('./BaseModel');

class DoctorDetail extends BaseModel {
  static init(sequelize, Sequelize) {
    return super.init(
      {
        id: {
          type: Sequelize.INTEGER(11).UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
        },
        uuid: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
        },
        about: Sequelize.STRING,
        experience: Sequelize.FLOAT,
        address_1: Sequelize.STRING,
        address_2: Sequelize.STRING,
        suburb: Sequelize.STRING,
        state: Sequelize.STRING,
        country: Sequelize.STRING,
        pin_code: Sequelize.STRING,
        qualifications: Sequelize.STRING,
        provider_number: Sequelize.STRING,
        features: Sequelize.JSON,
        rating: { type: Sequelize.FLOAT, allowNull: true, defaultValue: 0 },
        rating_count: { type: Sequelize.INTEGER, defaultValue: 0 },        
      },
      {
        modelName: 'DoctorDetail',
        tableName: 'doctor_details',
        underscored: true,
        timeStamp: true,
        getterMethods: {},
        sequelize,
        paranoid : true
      }
    );
  }

  static associate(models) {
    models.DoctorDetail.belongsTo(models.User, {
      foreignKey: 'user_id',
      constraints: false,
      as: 'doctor',
    });
    models.DoctorDetail.hasMany(models.ScreenQuestionsLink, {
      foreignKey: 'owner_id',
      constraints: false,
      as: 'doctor_screen_questions',
      scope: {
        owner_type: 'doctor',
      },
    });
  }
}

DoctorDetail.fillables = [
  'about',
  'experience',
  'address_1',
  'address_2',
  'suburb',
  'state',
  'country',
  'pin_code',
  'qualifications',
  'features',
  'provider_number'
];

DoctorDetail.hidden = [];

module.exports = DoctorDetail;
