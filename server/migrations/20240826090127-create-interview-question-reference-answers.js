'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('InterviewQuestionReferenceAnswers', {
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
      reference_answer_text: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      media_url: {
        type: Sequelize.STRING,
        allowNull: true, // Optional field for media
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
    await queryInterface.dropTable('InterviewQuestionReferenceAnswers');
  }
};
