'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('JobInterviewPrompts', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      client_job_interview_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'ClientJobInterviews', // Matches the table name
          key: 'id',
        },
        allowNull: false,
        onDelete: 'CASCADE',
      },
      evaluation_category_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'JobInterviewEvaluationCategories', // Matches the table name
          key: 'id',
        },
        allowNull: false,
        onDelete: 'CASCADE',
      },
      prompt_text: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      scoring_criteria: {
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
    await queryInterface.dropTable('JobInterviewPrompts');
  }
};
