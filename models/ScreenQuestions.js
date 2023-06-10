const BaseModel = require('./BaseModel');

class ScreenQuestions extends BaseModel {
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
        type: Sequelize.STRING(1000),
        options: Sequelize.STRING(1000),
      },
      {
        modelName: 'ScreenQuestions',
        tableName: 'screen_questions',
        underscored: true,
        timeStamp: true,
        getterMethods: {},
        sequelize,
        paranoid : true
      }
    );
  }

  static associate(models) {
   
    models.ScreenQuestions.hasMany(models.ScreenQuestionsLink, {
      foreignKey: 'question_id',
      constraints: false,
      as: 'screen_questions',
    });
  }
}

ScreenQuestions.fillables = [];

ScreenQuestions.hidden = [];

module.exports = ScreenQuestions;
