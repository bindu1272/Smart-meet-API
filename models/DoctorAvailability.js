const { intval } = require('locutus/php/var');
const BaseModel = require('./BaseModel');

class DoctorAvailability extends BaseModel {
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
        day: Sequelize.DATE,
        from_time: Sequelize.BOOLEAN,
        to_time: Sequelize.TIME,
        to_time: Sequelize.TIME,
      },
      {
        modelName: 'DoctorAvailability',
        tableName: 'doctor_leaves',
        underscored: true,
        timeStamp: true,
        getterMethods: {},
        sequelize,
      }
    );
  }

  static associate() {
    // models.DoctorLeave.belongsTo(models.HospitalUser, {
    //   foreignKey: 'user_id',
    //   constraints: false,
    //   as: 'leave_hospital_user',
    // });
  }
}

DoctorAvailability.fillables = [];

DoctorAvailability.hidden = [];

module.exports = DoctorAvailability;
