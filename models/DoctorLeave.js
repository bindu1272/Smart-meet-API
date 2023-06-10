const { intval } = require('locutus/php/var');
const BaseModel = require('./BaseModel');

class DoctorLeave extends BaseModel {
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
        date: Sequelize.DATEONLY,
        whole_day: Sequelize.BOOLEAN,
        reason: Sequelize.STRING,
      },
      {
        modelName: 'DoctorLeave',
        tableName: 'doctor_leaves',
        underscored: true,
        timeStamp: true,
        getterMethods: {},
        sequelize,
      }
    );
  }

  static associate(models) {
    models.DoctorLeave.belongsTo(models.HospitalUser, {
      foreignKey: 'hospital_user_id',
      constraints: false,
      as: 'leave_hospital_user',
    });

    models.DoctorLeave.hasMany(models.LeaveHour, {
      foreignKey: 'leave_id',
      constraints: false,
      as: 'leave_hours',
    });
  }
}

DoctorLeave.fillables = [];

DoctorLeave.hidden = [];

module.exports = DoctorLeave;
