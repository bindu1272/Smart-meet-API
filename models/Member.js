const BaseModel = require('./BaseModel');

class Member extends BaseModel {
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
        name: Sequelize.STRING,
        insurance_details: Sequelize.JSON,
        address_details: Sequelize.JSON,
        is_primary: Sequelize.BOOLEAN,
        age: Sequelize.INTEGER,
        gender: Sequelize.STRING,
        relation: Sequelize.STRING,
        contact_code: Sequelize.STRING,
        contact_number: Sequelize.STRING,
        height: Sequelize.FLOAT,
        weight: Sequelize.FLOAT,
        blood_group: Sequelize.STRING,
        dob: Sequelize.DATE,
      },
      {
        modelName: 'Member',
        tableName: 'members',
        underscored: true,
        timeStamp: true,
        getterMethods: {},
        sequelize,
      }
    );
  }

  static associate(models) {
    models.Member.belongsTo(models.User, {
      foreignKey: 'user_id',
      constraints: false,
      as: 'member_user',
    });

    models.Member.hasMany(models.Appointment, {
      foreignKey: 'member_id',
      constraints: false,
      as: 'member_appointments',
    });
  }
}

Member.fillables = [
  'name',
  'insurance_details',
  'address_details',
  'age',
  'gender',
  'relation',
  'contact_code',
  'contact_number',
  'height',
  'weight',
  'blood_group',
  'dob',
];

Member.hidden = [];

module.exports = Member;
