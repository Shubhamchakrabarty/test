'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('JobInterviewLevelAssessments', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      user_client_job_interview_attempt_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'UserClientJobInterviewAttempts',
          key: 'id',
        },
        allowNull: false,
        onDelete: 'CASCADE',
      },
      evaluation_category_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'JobInterviewEvaluationCategories',
          key: 'id',
        },
        allowNull: false,
      },
      score: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
      },
      feedback: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('JobInterviewLevelAssessments');
  }
};
