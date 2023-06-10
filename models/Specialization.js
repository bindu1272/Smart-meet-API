const BaseModel = require('./BaseModel');

class Specialization extends BaseModel {
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
        name: Sequelize.STRING,
        small_image: Sequelize.STRING,
        large_image: Sequelize.STRING,
      },
      {
        modelName: 'Specialization',
        tableName: 'specializations',
        underscored: true,
        timeStamp: true,
        getterMethods: {},
        sequelize,
      }
    );
  }

  static associate(models) {
    models.Specialization.belongsToMany(models.User, {
      through: 'doctor_specializations',
      as: 'specialization_users',
    });

    models.Specialization.belongsToMany(models.Hospital, {
      through: 'hospital_specializations',
      as: 'specialization_hospitals',
    });
  }
}

Specialization.fillables = [];

Specialization.hidden = [];

module.exports = Specialization;
