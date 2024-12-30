'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('InterviewInstructions', 'context_video_text', {
      type: Sequelize.TEXT,
      allowNull: true, // Optional field
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('InterviewInstructions', 'context_video_text');
  }
};
