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
      'members', // table name
      'height', // new field name
      {
        type: Sequelize.FLOAT,
      }
    );
    let promise2 = queryInterface.addColumn(
      'members', // table name
      'weight', // new field name
      {
        type: Sequelize.FLOAT,
      }
    );
    let promise3 = queryInterface.addColumn(
      'members', // table name
      'blood_group', // new field name
      {
        type: Sequelize.STRING,
      }
    );
    let promise4 = queryInterface.addColumn(
      'members', // table name
      'dob', // new field name
      {
        type: Sequelize.DATE,
      }
    );
    await Promise.all([promise1, promise2, promise3, promise4]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'members', // table name
      'height' // new field name
    );
    await queryInterface.removeColumn(
      'members', // table name
      'weight' // new field name
    );
    await queryInterface.removeColumn(
      'members', // table name
      'blood_group' // new field name
    );
    await queryInterface.removeColumn(
      'members', // table name
      'dob' // new field name
    );
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
