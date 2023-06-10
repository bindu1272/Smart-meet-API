const BaseModel = require('./BaseModel');

class City extends BaseModel {
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
        country: Sequelize.STRING,
        lat: Sequelize.Sequelize.DECIMAL(16, 10),
        lng: Sequelize.Sequelize.DECIMAL(16, 10),
        ne_lat: Sequelize.Sequelize.DECIMAL(16, 10),
        sw_lat: Sequelize.Sequelize.DECIMAL(16, 10),
        ne_lng: Sequelize.Sequelize.DECIMAL(16, 10),
        sw_lng: Sequelize.Sequelize.DECIMAL(16, 10),
        is_active: {
          type: Sequelize.BOOLEAN,
          defaultValue: true,
        },
      },
      {
        modelName: 'City',
        tableName: 'cities',
        underscored: true,
        timeStamp: true,
        getterMethods: {},
        sequelize,
        paranoid:true,
      }
    );
  }

  static associate(models) {
    models.City.hasMany(models.Hospital, {
      foreignKey: 'city_id',
      constraints: false,
      as: 'city_hospitals',
    });
  }
}

City.fillables = [];

City.hidden = [];

module.exports = City;
