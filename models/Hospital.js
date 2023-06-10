const BaseModel = require('./BaseModel');

class Hospital extends BaseModel {
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
        logo: Sequelize.STRING,
        banner: Sequelize.STRING,
        description: Sequelize.STRING(10000),
        contact_code: Sequelize.STRING,
        contact_number: Sequelize.STRING,
        address_1: Sequelize.STRING,
        address_2: Sequelize.STRING,
        suburb: Sequelize.STRING,
        state: Sequelize.STRING,
        country: Sequelize.STRING,
        pin_code: Sequelize.STRING,
        doctor_count: Sequelize.INTEGER,
        brand_color: Sequelize.JSON,
        fax_number: Sequelize.STRING,
        sponsership_required: Sequelize.TINYINT,
        website: Sequelize.STRING,
        billing_method: Sequelize.INTEGER,
        billing_unit_amount: Sequelize.FLOAT,
        slug: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        },
        longitude: Sequelize.FLOAT,
        latitude: Sequelize.FLOAT,
        appointment_booking_duration: Sequelize.INTEGER,
        appointment_cancellation_duration: Sequelize.INTEGER,
        contact_hours: Sequelize.JSON,
        verified: {
          type: Sequelize.TINYINT,
          defaultValue: false,
        },
        reject_reason: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        rating: { type: Sequelize.FLOAT, allowNull: true, defaultValue: 0 },
        rating_count: { type: Sequelize.INTEGER, defaultValue: 0 },
        //this corresponds to location id which is returned
        //when the hospital is registerred in medicare for claims
        ex_medicare_location_id: { type: Sequelize.STRING, allowNull: true },
        logo_url: Sequelize.STRING
      },
      {
        modelName: 'Hospital',
        tableName: 'hospitals',
        underscored: true,
        timeStamp: true,
        getterMethods: {},
        sequelize,
      }
    );
  }

  static associate(models) {
    models.Hospital.hasMany(models.Invoice, {
      foreignKey: 'hospital_id',
      constraints: false,
      as: 'hospital_invoices',
    });

    models.Hospital.hasMany(models.Department, {
      foreignKey: 'hospital_id',
      constraints: false,
      as: 'hospital_departments',
    });

    models.Hospital.hasMany(models.HospitalAppointmentStats, {
      foreignKey: 'hospital_id',
      constraints: false,
      as: 'hospital_stats',
    });

    models.Hospital.belongsToMany(models.User, {
      as: 'users',
      through: {
        model: models.HospitalUser,
        unique: false,
      },
    });

    models.Hospital.belongsToMany(models.Specialization, {
      through: 'hospital_specializations',
      as: 'hospital_specs',
    });

    models.Hospital.hasMany(models.WorkingHour, {
      foreignKey: 'owner_id',
      constraints: false,
      as: 'hospital_working_hours',
      scope: {
        owner: 'hospital',
      },
    });

    models.Hospital.hasMany(models.Faq, {
      foreignKey: 'owner_id',
      constraints: false,
      as: 'hospital_faqs',
      scope: {
        owner_type: 'hospital',
      },
    });

    models.Hospital.belongsTo(models.City, {
      foreignKey: 'city_id',
      constraints: false,
      as: 'hospital_city',
    });
    models.Hospital.belongsTo(models.HospitalUser, {
      foreignKey: 'hospital_agent_id',
      constraints: false,
      as: 'hospital_agent_user',
    });

    models.Hospital.hasMany(models.Ads, {
      foreignKey: 'owner_id',
      constraints: false,
      as: 'hospital_ads',
    });
    
    models.Hospital.hasMany(models.Notifications, {
      foreignKey: 'owner_id',
      constraints: false,
      as: 'hospital_notifications',
    });
    // models.Hospital.hasMany(models.ScreenQuestions, {
    //   foreignKey: 'owner_id',
    //   constraints: false,
    //   as: 'hospital_screen_questions',
    // });
    models.DoctorDetail.hasMany(models.ScreenQuestionsLink, {
      foreignKey: 'owner_id',
      constraints: false,
      as: 'hospital_screen_questions',
      scope: {
        owner_type: 'hospital',
      },
    });
  }
}

Hospital.fillables = [];

Hospital.hidden = [];

module.exports = Hospital;
