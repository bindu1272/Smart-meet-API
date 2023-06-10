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
    await queryInterface.bulkInsert(
      'specializations',
      [
        {
          uuid: '4bf3e059-eec5-4171-a32b-c95c7b4dee06',
          name: 'Dentist',
          small_image: 'small-specilisation-icon/teeth.svg',
          large_image: 'large-specilisation-icon/teeth.svg',
          created_at: new Date(),
          updated_at: new Date(),
        },

        {
          uuid: '578051b8-64b9-4a79-8d0e-ed5da38c5244',
          name: 'Cardiologist',
          small_image: 'small-specilisation-icon/heart.svg',
          large_image: 'large-specilisation-icon/heart.svg',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          uuid: '55d32641-a197-41f0-aca6-fdff0c37f765',
          name: 'Pulmonologist',
          small_image: 'small-specilisation-icon/lungs.svg',
          large_image: 'large-specilisation-icon/lungs.svg',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          uuid: '5ab880b3-9710-4074-8a9c-8430e514b8a3',
          name: 'Gastroenterologist',
          small_image: 'small-specilisation-icon/stomach.svg',
          large_image: 'large-specilisation-icon/stomach.svg',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          uuid: '2f445154-882e-4831-942f-d70fc9872e0a',
          name: 'Nephrologist',
          small_image: 'small-specilisation-icon/kidney.svg',
          large_image: 'large-specilisation-icon/kidney.svg',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          uuid: '467c1b15-95f1-43db-9e1a-96ce544f28aa',
          name: 'Orthopedic',
          small_image: 'small-specilisation-icon/kneebone.svg',
          large_image: 'large-specilisation-icon/kneebone.svg',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
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
