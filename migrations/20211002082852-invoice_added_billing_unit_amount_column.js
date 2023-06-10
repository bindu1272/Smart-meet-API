'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return await queryInterface.addColumn(
      'invoices', // table name
      'unit_amount', // new field name
      {
        type: Sequelize.FLOAT,
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.removeColumn(
      'invoices', // table name
      'unit_amount' // new field name
    );
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
