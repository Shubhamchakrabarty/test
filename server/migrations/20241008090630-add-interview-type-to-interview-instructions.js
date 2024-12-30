'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('InterviewInstructions', 'interview_response_type', {
      type: Sequelize.ENUM('audio', 'text', 'video'),
      allowNull: false,
      defaultValue: 'audio',  // Set 'audio' as the default type
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('InterviewInstructions', 'interview_response_type');
  }
};
