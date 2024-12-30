'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('VideoUploads', 'user_client_job_interview_attempt_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'UserClientJobInterviewAttempts', // The table you're referencing
        key: 'id',
      },
      onDelete: 'CASCADE',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('VideoUploads', 'user_client_job_interview_attempt_id');
  }
};
