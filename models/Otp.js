const BaseModel = require('./BaseModel');

class Otp extends BaseModel {
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
        otp: Sequelize.STRING,
        media_type: Sequelize.INTEGER,
        owner_id: Sequelize.INTEGER,
        owner: Sequelize.STRING,
        owner_type: Sequelize.INTEGER,
        status: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
        },
      },
      {
        modelName: 'Otp',
        tableName: 'otps',
        underscored: true,
        timeStamp: true,
        getterMethods: {},
        sequelize,
      }
    );
  }

  static associate(models) {}
}

Otp.fillables = [];

Otp.hidden = [];

module.exports = Otp;
