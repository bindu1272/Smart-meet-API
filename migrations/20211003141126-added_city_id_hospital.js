'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.addColumn(
      'hospitals', // table name
      'city_id', // new field name
      {
        type: Sequelize.INTEGER,
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.removeColumn(
      'hospitals', // table name
      'city_id' // new field name
    );
  },
};
