'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert('users', [
      {
        uuid: '83c81c92-33d2-4b3e-87eb-a15b99644c423',
        title: 'Ms',
        name: 'Super Admin123',
        image: null,
        contact_code: '+91',
        contact_number: '630999999',
        email: 'superadmin123@smartmeet.com',
        password:
          '$2b$10$peLcexKv7K90OxkP6lZU7O5FUcF2Nr1kxUsj1KUnSjPXmcu/nLHoW',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
