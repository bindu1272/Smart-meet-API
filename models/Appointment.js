const BaseModel = require('./BaseModel');

class Appointment extends BaseModel {
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
        appointment_id: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        date: Sequelize.DATEONLY,
        slot: Sequelize.INTEGER,
        type: Sequelize.INTEGER,
        status: Sequelize.INTEGER,
        patient_answers: Sequelize.STRING,
        reschedule_reason: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        cancel_reason: {
          type: Sequelize.STRING,
          allowNull: true,
        },
      },
      {
        modelName: 'Appointment',
        tableName: 'appointments',
        underscored: true,
        timeStamp: true,
        getterMethods: {},
        sequelize,
      }
    );
  }

  static associate(models) {
    models.Appointment.belongsTo(models.Hospital, {
      foreignKey: 'hospital_id',
      constraints: false,
      as: 'appointment_hospital',
    });

    models.Appointment.belongsTo(models.Member, {
      foreignKey: 'member_id',
      constraints: false,
      as: 'appointment_member',
    });

    models.Appointment.belongsTo(models.User, {
      foreignKey: 'doctor_id',
      constraints: false,
      as: 'appointment_doctor',
    });

    models.Appointment.hasOne(models.AppointmentNote, {
      foreignKey: 'appointment_id',
      constraints: false,
      as: 'appointment_notes',
    });

    models.Appointment.hasOne(models.Claim, {
      foreignKey: 'appointment_id',
      constraints: false,
      as: 'appointment_claim',
    });

    models.Appointment.hasMany(models.Review, {
      foreignKey: 'owner_id',
      constraints: false,
      as: 'appointment_ratings',
      scope: {
        owner_type: 'appointment',
      },
    });

    models.Appointment.hasMany(models.Review, {
      foreignKey: 'owner_id',
      constraints: false,
      as: 'hospital_ratings',
      scope: {
        owner_type: 'hospital',
      },
    });
  }
}

Appointment.fillables = [];

Appointment.hidden = [];

module.exports = Appointment;
