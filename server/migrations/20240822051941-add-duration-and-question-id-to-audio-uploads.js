'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('AudioUploads', 'duration', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.addColumn('AudioUploads', 'question_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('AudioUploads', 'duration');
    await queryInterface.removeColumn('AudioUploads', 'question_id');
  }
};
