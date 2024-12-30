'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Add unique constraint for job_id and interview_id
    await queryInterface.addConstraint('ClientJobInterviews', {
      fields: ['job_id', 'interview_id'],
      type: 'unique',
      name: 'unique_job_interview' // Constraint name
    });

    // Add unique constraint for job_id and interview_order
    await queryInterface.addConstraint('ClientJobInterviews', {
      fields: ['job_id', 'interview_order'],
      type: 'unique',
      name: 'unique_job_order' // Constraint name
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('ClientJobInterviews', 'unique_job_interview');
    await queryInterface.removeConstraint('ClientJobInterviews', 'unique_job_order');
  }
};
