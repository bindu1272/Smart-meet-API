const BaseModel = require('./BaseModel');

class HospitalAppointmentStats extends BaseModel {
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
        modelName: 'HospitalAppointmentStats',
        tableName: 'hospital_appointment_stats',
        underscored: true,
        timeStamp: true,
        getterMethods: {},
        sequelize,
      }
    );
  }

  static associate(models) {
    models.HospitalAppointmentStats.belongsTo(models.Hospital, {
      foreignKey: 'hospital_id',
      constraints: false,
      as: 'stats_hospital',
    });
  }
}

HospitalAppointmentStats.fillables = [
  'date',
  'complete',
  'cancelled',
  'noShow',
];

HospitalAppointmentStats.hidden = [];

module.exports = HospitalAppointmentStats;
