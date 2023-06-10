'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.addColumn(
      'cities', // table name
      'deleted_At', // new field name
      {
        type: Sequelize.STRING,
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.removeColumn(
      'cities', // table name
      'deleted_At' // new field name
    );
  },
};
