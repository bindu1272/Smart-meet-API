const BaseModel = require('./BaseModel');

class InvitationLink extends BaseModel {
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
        owner: Sequelize.INTEGER,
        email: Sequelize.STRING,
        owner_type: Sequelize.INTEGER,
        data: Sequelize.JSON,
        status: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
        },
      },
      {
        modelName: 'InvitationLink',
        tableName: 'invitation_links',
        underscored: true,
        timeStamp: true,
        getterMethods: {},
        sequelize,
      }
    );
  }

  static associate(models) {}
}

InvitationLink.fillables = [];

InvitationLink.hidden = [];

module.exports = InvitationLink;
