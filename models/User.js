const BaseModel = require('./BaseModel');

class User extends BaseModel {
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
        title: Sequelize.STRING,
        name: Sequelize.STRING,
        first_name: Sequelize.STRING,
        last_name: Sequelize.STRING,
        image: Sequelize.STRING,
        image_url : Sequelize.STRING,
        contact_code: Sequelize.STRING,
        contact_number: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.STRING,
        last_login: {
          type: Sequelize.DATE,
        },
        gender: {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: 'M',
        },
        is_active: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
      },
      {
        modelName: 'User',
        tableName: 'users',
        underscored: true,
        timeStamp: true,
        getterMethods: {
          fullName: () => {
            return `${this.first_name ? this.first_name : ''} ${
              this.last_name ? this.last_name : ''
            }`;
          },
        },
        sequelize,
        paranoid:true
      }
    );
  }

  static associate(models) {
    models.User.hasMany(models.Member, {
      foreignKey: 'user_id',
      constraints: false,
      as: 'user_members',
    });

    models.User.hasOne(models.DoctorDetail, {
      foreignKey: 'user_id',
      constraints: false,
      as: 'doctor_detail',
    });

    models.User.belongsToMany(models.Hospital, {
      as: 'hospitals',
      through: {
        model: models.HospitalUser,
        unique: false,
      },
    });

    models.User.belongsToMany(models.Specialization, {
      through: 'doctor_specializations',
      as: 'user_specializations',
    });

    models.User.hasMany(models.UserFavourite, {
      foreignKey: 'user_id',
      constraints: false,
      as: 'patient_favourites',
    });

    models.User.hasMany(models.DoctorAppointmentStats, {
      foreignKey: 'user_id',
      constraints: false,
      as: 'doctor_stats',
    });

    models.User.hasMany(models.AppointmentNote, {
      foreignKey: 'user_id',
      constraints: false,
      as: 'user_updated_notes',
    });

    models.User.hasMany(models.Faq, {
      foreignKey: 'owner_id',
      constraints: false,
      as: 'doctor_faqs',
      scope: {
        owner_type: 'Doctor',
      },
    });
  }
}

User.fillables = [
  'title',
  'name',
  'email',
  'contact_code',
  'contact_number',
  'image',
];
User.updateFillables = [
  'title',
  'name',
  'contact_code',
  'contact_number',
  'image',
];

User.hidden = ['id', 'password'];

module.exports = User;
