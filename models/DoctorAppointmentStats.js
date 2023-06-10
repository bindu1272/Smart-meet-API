const BaseModel = require('./BaseModel');

class DoctorAppointmentStats extends BaseModel {
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
        complete: Sequelize.INTEGER,
        cancelled: Sequelize.INTEGER,
        noShow: Sequelize.INTEGER,
      },
      {
        modelName: 'DoctorAppointmentStats',
        tableName: 'doctor_appointment_stats',
        underscored: true,
        timeStamp: true,
        getterMethods: {},
        sequelize,
      }
    );
  }

  static associate(models) {
    models.DoctorAppointmentStats.belongsTo(models.Hospital, {
      foreignKey: 'hospital_id',
      constraints: false,
      as: 'stats_hospital',
    });
    models.DoctorAppointmentStats.belongsTo(models.User, {
      foreignKey: 'doctor_id',
      constraints: false,
      as: 'stats_doctor',
    });
  }
}

DoctorAppointmentStats.fillables = ['date', 'complete', 'cancelled', 'noShow'];

DoctorAppointmentStats.hidden = [];

module.exports = DoctorAppointmentStats;
