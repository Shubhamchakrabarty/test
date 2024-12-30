'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('AnswerTextUploads', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users', // References the 'Users' table
          key: 'id',
        },
        allowNull: false,
        onDelete: 'CASCADE', // Ensures referential integrity
      },
      interview_question_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'InterviewQuestions', // References the 'InterviewQuestions' table
          key: 'id',
        },
        allowNull: false,
        onDelete: 'CASCADE',
      },
      answer_text: {
        type: Sequelize.TEXT,
        allowNull: false, // Ensure no `null` values but allow empty strings
        defaultValue: '',  // Default to an empty string
      },
      time_taken_to_answer: {
        type: Sequelize.FLOAT,
        allowNull: false, // Capture time taken for WPM calculation
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('AnswerTextUploads');
  }
};
