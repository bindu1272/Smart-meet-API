const BaseModel = require('./BaseModel');

class UserFavourite extends BaseModel {
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

        owner_type: Sequelize.STRING,
        owner_id: Sequelize.INTEGER,
      },
      {
        modelName: 'UserFavourite',
        tableName: 'user_favourites',
        underscored: true,
        timeStamp: true,
        getterMethods: {},
        sequelize,
      }
    );
  }

  static associate(models) {
    models.UserFavourite.belongsTo(models.User, {
      foreignKey: 'user_id',
      constraints: false,
      as: 'favourite_patient',
    });
  }
}

UserFavourite.fillables = ['owner_type', 'owner_id', 'user_id'];

UserFavourite.hidden = [];

module.exports = UserFavourite;
