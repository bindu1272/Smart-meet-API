'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn(
      'doctor_details', // table name
      'rating', // new field name
      {
        type: Sequelize.FLOAT,
        allowNull: true,
        defaultValue: 0,
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'doctor_details', // table name
      'rating', // new field name
      {
        type: Sequelize.FLOAT,
        allowNull: true,
      }
    );
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
