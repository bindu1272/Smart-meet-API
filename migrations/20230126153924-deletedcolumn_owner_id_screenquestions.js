'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('screen_questions', 'owner_id');
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('screen_questions');
  }
};