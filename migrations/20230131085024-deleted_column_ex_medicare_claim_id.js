'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('claims', 'medicare_claim_id');
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('claims');
  }
};