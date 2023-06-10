'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.addColumn(
      'screen_questions_link', // table name
      'is_include', // new field name
      {
        type: Sequelize.BOOLEAN,
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.removeColumn(
      'screen_questions_link', // table name
      'is_include' // new field name
    );
  },
};
