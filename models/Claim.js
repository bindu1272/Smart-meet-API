const BaseModel = require('./BaseModel');

class Claim extends BaseModel {
    static init(sequelize, Sequelize) {
        return super.init(
            {
                id: {
                    type: Sequelize.INTEGER(11).UNSIGNED,
                    autoIncrement: true,
                    primaryKey: true,
                },
                type: Sequelize.INTEGER,
                service_type: Sequelize.STRING,
                start_date: Sequelize.DATEONLY,
                end_date: { type: Sequelize.DATEONLY, allowNull: true },
                status: Sequelize.INTEGER,
                items: Sequelize.JSON,
                claimed_amount: { type: Sequelize.STRING, allowNull: true },
                recieved_amount: { type: Sequelize.STRING, allowNull: true },
                //this id is the one returned when claim request is submitted to medicare
                ex_medicare_claim_id: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
            },
            {
                modelName: 'Claim',
                tableName: 'claims',
                underscored: true,
                timeStamp: true,
                getterMethods: {},
                sequelize,
            }
        );
    }

    static associate(models) {
        models.Claim.belongsTo(models.Appointment, {
            foreignKey: 'appointment_id',
            constraints: false,
            as: 'claim_appointment',
        });        
    }
}

Claim.fillables = [
    'type','service_type','items','recieved_amount'
];

Claim.hidden = [];

module.exports = Claim;
