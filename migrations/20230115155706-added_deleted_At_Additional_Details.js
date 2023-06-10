'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.addColumn(
      'additional_details', // table name
      'deleted_at', // new field name
      {
        type: Sequelize.DATE,
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.removeColumn(
      'additional_details', // table name
      'deleted_at' // new field name
    );
  },
};
