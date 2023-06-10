const BaseModel = require('./BaseModel');

class Invoice extends BaseModel {
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
        month: Sequelize.INTEGER,
        year: Sequelize.INTEGER,
        amount: Sequelize.FLOAT,
        status: Sequelize.INTEGER,
        paid_date: Sequelize.DATE,
        payment_reference_id: Sequelize.STRING,
        units: Sequelize.INTEGER,
        unit_type: Sequelize.INTEGER,
        unit_amount: Sequelize.FLOAT,
        invoice_number: Sequelize.STRING,
      },
      {
        modelName: 'Invoice',
        tableName: 'invoices',
        underscored: true,
        timeStamp: true,
        getterMethods: {},
        sequelize,
      }
    );
  }

  static associate(models) {
    models.Invoice.belongsTo(models.Hospital, {
      foreignKey: 'hospital_id',
      constraints: false,
      as: 'invoice_hospital',
    });
  }
}

Invoice.fillables = [];

Invoice.hidden = [];

module.exports = Invoice;
