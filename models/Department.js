const BaseModel = require('./BaseModel');

class Department extends BaseModel {
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
        email: Sequelize.STRING,
        contact_code: Sequelize.STRING,
        contact_number: Sequelize.STRING,
      },
      {
        modelName: 'Department',
        tableName: 'departments',
        underscored: true,
        timeStamp: true,
        getterMethods: {},
        sequelize,
        paranoid:true
      }
    );
  }

  static associate(models) {
    models.Department.belongsToMany(models.HospitalUser, {
      through: 'department_hospital_users',
      as: 'department_users',
    });

    models.Department.belongsTo(models.Hospital, {
      foreignKey: 'hospital_id',
      constraints: false,
      as: 'department_hospital',
    });
  }
}

Department.fillables = [];

Department.hidden = [];

module.exports = Department;
