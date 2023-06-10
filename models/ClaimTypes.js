const BaseModel = require('./BaseModel');

class ClaimTypes extends BaseModel {
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
        type: Sequelize.STRING,
        deleted_at: Sequelize.DATE,
      },
      {
        modelName: 'ClaimTypes',
        tableName: 'claim_types',
        underscored: true,
        timeStamp: true,
        getterMethods: {},
        sequelize,
        paranoid:true,
      }
    );
  }
}

ClaimTypes.fillables = [];

ClaimTypes.hidden = [];

module.exports = ClaimTypes;
