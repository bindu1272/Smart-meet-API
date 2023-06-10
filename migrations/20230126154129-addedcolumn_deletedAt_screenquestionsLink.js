'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.addColumn(
      'screen_questions_link', // table name
      'deleted_at', // new field name
      {
        type: Sequelize.DATE,
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.removeColumn(
      'screen_questions_link', // table name
      'deleted_at' // new field name
    );
  },
};
