const BaseModel = require('./BaseModel');

class ScreenQuestionsLink extends BaseModel {
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
        question_id: {
          type: Sequelize.INTEGER,
        },
        owner_id: {
          type: Sequelize.INTEGER,
        },
        owner_type: Sequelize.STRING,
        is_include: {
          type: Sequelize.BOOLEAN,
        },
      },
      {
        modelName: 'ScreenQuestionsLink',
        tableName: 'screen_questions_link',
        underscored: true,
        timeStamp: true,
        getterMethods: {},
        sequelize,
        paranoid:true,
      }
    );
  }

  static associate(models) {
    models.ScreenQuestionsLink.belongsTo(models.ScreenQuestions, {
      foreignKey: 'question_id',
      constraints: false,
      as: 'screen_questions_id',
    });
    models.ScreenQuestionsLink.belongsTo(models.Hospital, {
      foreignKey: 'owner_id',
      constraints: false,
      as: 'screen_questions_hospital',
    });
    models.ScreenQuestionsLink.belongsTo(models.DoctorDetail, {
        foreignKey: 'owner_id',
        constraints: false,
        as: 'screen_questions_doctor',
      });
  }
}

ScreenQuestionsLink.fillables = [];

ScreenQuestionsLink.hidden = [];

module.exports = ScreenQuestionsLink;
