const BaseModel = require('./BaseModel');

class HospitalUser extends BaseModel {
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
        user_id: {
          type: Sequelize.INTEGER,
        },
        hospital_id: {
          type: Sequelize.INTEGER,
        },
        slot_duration: Sequelize.INTEGER,
        role_id: Sequelize.INTEGER,
        //this corresponds to doctors provider id
        //when he registers in medicare
        ex_medicare_provider_number: { type: Sequelize.STRING, allowNull: true },
      },
      {
        modelName: 'HospitalUser',
        tableName: 'hospital_users',
        underscored: true,
        timeStamp: true,
        getterMethods: {},
        sequelize,
      }
    );
  }

  static associate(models) {
    models.HospitalUser.belongsTo(models.User, {
      foreignKey: 'user_id',
      constraints: false,
      as: 'hospital_user_user',
    });

    models.HospitalUser.belongsTo(models.Hospital, {
      foreignKey: 'hospital_id',
      constraints: false,
      as: 'hospital_user_hospital',
    });

    models.HospitalUser.hasMany(models.DoctorLeave, {
      foreignKey: 'hospital_user_id',
      constraints: false,
      as: 'hospital_user_leaves',
    });

    models.HospitalUser.belongsToMany(models.HospitalUser, {
      foreignKey: 'doctor_id',
      as: 'delegates',
      through: 'doctor_delegates',
    });

    models.HospitalUser.belongsToMany(models.HospitalUser, {
      foreignKey: 'delegate_id',
      as: 'doctors',
      through: 'doctor_delegates',
    });

    models.HospitalUser.belongsToMany(models.Department, {
      through: 'department_hospital_users',
      as: 'departments',
    });

    models.HospitalUser.hasMany(models.WorkingHour, {
      foreignKey: 'owner_id',
      constraints: false,
      as: 'staff_working_hours',
      scope: {
        owner: 'staff',
      },
    });
  }
}

HospitalUser.fillables = [];

HospitalUser.hidden = [];

module.exports = HospitalUser;
