const BaseModel = require('./BaseModel');

class WorkingHour extends BaseModel {
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
        day: Sequelize.INTEGER,
        from_time: Sequelize.TIME,
        to_time: Sequelize.TIME,
        owner: Sequelize.STRING,
      },
      {
        modelName: 'WorkingHour',
        tableName: 'working_hours',
        underscored: true,
        timeStamp: true,
        getterMethods: {},
        sequelize,
      }
    );
  }

  static associate(models) {
    models.WorkingHour.belongsTo(models.Hospital, {
      foreignKey: 'owner_id',
      constraints: false,
      as: 'hours_hospital',
    });
  }
}

WorkingHour.fillables = [];

WorkingHour.hidden = [];

module.exports = WorkingHour;
