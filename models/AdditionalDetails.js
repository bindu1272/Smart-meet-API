const BaseModel = require("./BaseModel");

class AdditionalDetails extends BaseModel {
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
        medicare_number: Sequelize.STRING,
        irn_number: Sequelize.STRING,
        medicare_valid: Sequelize.DATE,
        birth_country: Sequelize.STRING,
        cultural_background: Sequelize.STRING,
        primary_language: Sequelize.STRING,
        maritial_status: Sequelize.STRING,
        occupation: Sequelize.STRING,
        d_v_a_file_number: Sequelize.STRING,
        d_v_a_expiry_date: Sequelize.DATE,
        pension_card_number: Sequelize.STRING,
        pension_expiry: Sequelize.DATE,
        healthcare_card_number: Sequelize.STRING,
        healthcare_expiry: Sequelize.DATE,
        allergy_problems: Sequelize.STRING,
        emergency_contacts: Sequelize.STRING
      },
      {
        modelName: "AdditionalDetails",
        tableName: "additional_details",
        underscored: true,
        timeStamp: true,
        getterMethods: {},
        sequelize,
        paranoid:true
      }
    );
  }

  static associate(models) {
    models.AdditionalDetails.belongsTo(models.User, {
      foreignKey: "user_id",
      constraints: false,
      as: "additional_details_user",
    });
  }
}

AdditionalDetails.fillables = [
  'medicare_number',
  'irn_number',
  'medicare_valid',
  'birth_country',
  'cultural_background',
  'primary_language',
  'maritial_status',
  'occupation',
  'd_v_a_file_number',
  'd_v_a_expiry_date',
  'pension_card_number',
  'pension_expiry',
  'healthcare_card_number',
  'healthcare_expiry',
  'allergy_problems',
  'emergency_contacts',
];

AdditionalDetails.hidden = [];

module.exports = AdditionalDetails;
