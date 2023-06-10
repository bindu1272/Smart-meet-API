'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.addColumn(
      'hospital_users', // table name
      'ex_medicare_provider_number', // new field name
      {
        type: Sequelize.STRING,
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.removeColumn(
      'hospital_users', // table name
      'ex_medicare_provider_number' // new field name
    );
  },
};
