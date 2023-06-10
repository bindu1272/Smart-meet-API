'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    let promise1 = queryInterface.addColumn(
      'specializations', // table name
      'small_image', // new field name
      {
        type: Sequelize.STRING,
      }
    );
    let promise2 = queryInterface.addColumn(
      'specializations', // table name
      'large_image', // new field name
      {
        type: Sequelize.STRING,
      }
    );
    await Promise.all([promise1, promise2]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'specializations', // table name
      'small_image' // new field name
    );
    await queryInterface.removeColumn(
      'specializations', // table name
      'small_image' // new field name
    );
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
