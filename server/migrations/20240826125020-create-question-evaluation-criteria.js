'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('QuestionEvaluationCriteria', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      interview_question_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'InterviewQuestions',
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
        onDelete: 'CASCADE',
      },
      priority: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      instructions: {
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
    await queryInterface.dropTable('QuestionEvaluationCriteria');
  }
};
