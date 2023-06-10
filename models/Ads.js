const BaseModel = require('./BaseModel');

class Ads extends BaseModel {
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
        text: Sequelize.STRING(1000),
        video: Sequelize.STRING(1000),
        image: Sequelize.STRING(1000),
        owner_id: Sequelize.INTEGER,
        start_date: Sequelize.STRING,
        end_date: Sequelize.STRING,
        isSponsor: Sequelize.BOOLEAN,
        created_by: Sequelize.UUID
      },
      {
        modelName: 'Ads',
        tableName: 'ads',
        underscored: true,
        timeStamp: true,
        getterMethods: {},
        sequelize,
        paranoid : true
      }
    );
  }

  static associate(models) {
    models.Ads.belongsTo(models.Hospital, {
      foreignKey: 'owner_id',
      constraints: false,
      as: 'ads_hospital',
    });
  }
}

Ads.fillables = [
  'text',
  'video',
  'image',
  'isSponsor',
  'start_date',
  "end_date"
];

Ads.hidden = [];

module.exports = Ads;
