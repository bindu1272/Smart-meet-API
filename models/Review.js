const BaseModel = require('./BaseModel');

class Review extends BaseModel {
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
        rating: Sequelize.FLOAT,
        comment: Sequelize.STRING(1000),
        owner_type: Sequelize.STRING,
        owner_id: Sequelize.INTEGER,
      },
      {
        modelName: 'Review',
        tableName: 'reviews',
        underscored: true,
        timeStamp: true,
        getterMethods: {},
        sequelize,
      }
    );
  }

  static associate(models) {
    models.Review.belongsTo(models.Appointment, {
      foreignKey: 'owner_id',
      constraints: false,
      as: 'rating_hospital',
    });

    models.Review.belongsTo(models.Appointment, {
      foreignKey: 'owner_id',
      constraints: false,
      as: 'rating_appointment',
    });
  }
}

Review.fillables = [];

Review.hidden = [];

module.exports = Review;
