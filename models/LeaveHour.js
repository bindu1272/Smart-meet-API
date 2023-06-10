const BaseModel = require('./BaseModel');

class LeaveHour extends BaseModel {
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
        from_time: Sequelize.TIME,
        to_time: Sequelize.TIME,
      },
      {
        modelName: 'LeaveHour',
        tableName: 'leave_hours',
        underscored: true,
        timeStamp: true,
        getterMethods: {},
        sequelize,
      }
    );
  }

  static associate(models) {
    models.LeaveHour.belongsTo(models.DoctorLeave, {
      foreignKey: 'leave_id',
      constraints: false,
      as: 'hour_leave',
    });
  }
}

LeaveHour.fillables = [];

LeaveHour.hidden = [];

module.exports = LeaveHour;
