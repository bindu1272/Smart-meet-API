const BaseModel = require("./BaseModel");

class ContactUs extends BaseModel {
  static init(sequelize, Sequelize) {
    return super.init(
      {
        id : {
            type : Sequelize.INTEGER(11).UNSIGNED,
            autoIncrement : true,
            primaryKey : true
        },
        uuid: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
        },
        name :{
            type : Sequelize.STRING
        },
        email :{
            type : Sequelize.STRING
        },
        phone :{
            type : Sequelize.INTEGER(10).UNSIGNED,
        },
        comments :{
            type : Sequelize.STRING
        },
        is_active: {
          type: Sequelize.BOOLEAN,
          defaultValue: true,
        },
        image: Sequelize.STRING,
        image_url : Sequelize.STRING,
      },
      {
        modelName: 'ContactUs',
        tableName: 'contact_us',
        underscored: true,
        timeStamp: true,
        getterMethods: {},
        sequelize,
        paranoid:true,
      }
    );
  }
  static associate(models) {
    models.ContactUs.belongsTo(models.User, {
      foreignKey: 'user_id',
      constraints: false,
      as: 'user',
    });
  }
}

ContactUs.fillables = [];
ContactUs.hidden = [];

module.exports = ContactUs;
