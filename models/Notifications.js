const BaseModel = require('./BaseModel');

class Notifications extends BaseModel {
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
        image: Sequelize.STRING(1000),
        owner_id: Sequelize.INTEGER,
        start_date: Sequelize.STRING,
        end_date: Sequelize.STRING,
        isSponsor: Sequelize.BOOLEAN,
        created_by: Sequelize.UUID
      },
      {
        modelName: 'Notifications',
        tableName: 'notifications',
        underscored: true,
        timeStamp: true,
        getterMethods: {},
        sequelize,
        paranoid : true
      }
    );
  }

  static associate(models) {
    models.Notifications.belongsTo(models.Hospital, {
      foreignKey: 'owner_id',
      constraints: false,
      as: 'notifications_hospital',
    });
  }
}

Notifications.fillables = [
  'text',
  'image',
  'start_date',
  "end_date",
  'is_sponsor',
];

Notifications.hidden = [];

module.exports = Notifications;
