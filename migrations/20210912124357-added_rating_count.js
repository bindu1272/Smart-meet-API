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
      'doctor_details', // table name
      'rating_count', // new field name
      {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.removeColumn(
      'doctor_details', // table name
      'rating_count' // new field name
    );
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
