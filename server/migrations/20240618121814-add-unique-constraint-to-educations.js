'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint('Educations', {
      fields: ['user_id', 'university_id', 'degree_id'],
      type: 'unique',
      name: 'unique_user_university_degree'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('Educations', 'unique_user_university_degree');
  }
};
