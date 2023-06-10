'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.addColumn(
      'claims', // table name
      'ex_medicare_claim_id', // new field name
      {
        type: Sequelize.INTEGER,
        allowNull: true,
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.removeColumn(
      'claims', // table name
      'ex_medicare_claim_id' // new field name
    );
  },
};
