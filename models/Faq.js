const BaseModel = require('./BaseModel');

class Faq extends BaseModel {
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
        question: Sequelize.STRING(1000),
        answer: Sequelize.STRING(1000),
        owner_type: Sequelize.STRING,
        owner_id: Sequelize.INTEGER,
      },
      {
        modelName: 'Faq',
        tableName: 'faqs',
        underscored: true,
        timeStamp: true,
        getterMethods: {},
        sequelize,
      }
    );
  }

  static associate(models) {
    models.Faq.belongsTo(models.Hospital, {
      foreignKey: 'owner_id',
      constraints: false,
      as: 'faq_hospital',
    });
    models.Faq.belongsTo(models.User, {
      foreignKey: 'owner_id',
      constraints: false,
      as: 'faq_doctor',
    });
  }
}

Faq.fillables = [];

Faq.hidden = [];

module.exports = Faq;
