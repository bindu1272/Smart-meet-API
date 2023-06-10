const { intval } = require('locutus/php/var');
const BaseModel = require('./BaseModel');

class AppointmentNote extends BaseModel {
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
        notes: {
          type: Sequelize.JSON,
        },
      },
      {
        modelName: 'AppointmentNote',
        tableName: 'appointment_notes',
        underscored: true,
        timeStamp: true,
        getterMethods: {},
        sequelize,
      }
    );
  }

  static associate(models) {
    models.AppointmentNote.belongsTo(models.Appointment, {
      foreignKey: 'appointment_id',
      constraints: false,
      as: 'note_appointment',
    });
    models.AppointmentNote.belongsTo(models.User, {
      foreignKey: 'user_id',
      constraints: false,
      as: 'note_updated_by',
    });
  }
}

AppointmentNote.fillables = [];

AppointmentNote.hidden = [];

module.exports = AppointmentNote;
