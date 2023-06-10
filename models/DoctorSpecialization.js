const BaseModel = require('./BaseModel');

class DoctorSpecialization extends BaseModel {
  static init(sequelize, Sequelize) {
    return super.init(
      {},
      {
        modelName: 'DoctorSpecialization',
        tableName: 'doctor_specializations',
        underscored: true,
        timeStamp: true,
        getterMethods: {},
        sequelize,
      }
    );
  }

  static associate(models) {}
}

DoctorSpecialization.fillables = [];

DoctorSpecialization.hidden = [];

module.exports = DoctorSpecialization;
