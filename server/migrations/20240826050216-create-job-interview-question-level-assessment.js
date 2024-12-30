'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('JobInterviewQuestionLevelAssessments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      interview_response_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'InterviewResponses',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      user_client_job_interview_attempt_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'UserClientJobInterviewAttempts',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      evaluation_category_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'JobInterviewEvaluationCategories',
          key: 'id',
        },
      },
      follow_up_question_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'FollowUpQuestions',
          key: 'id',
        },
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
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('JobInterviewQuestionLevelAssessments');
  }
};
