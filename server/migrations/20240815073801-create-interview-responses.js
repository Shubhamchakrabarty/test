'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('InterviewResponses', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
        allowNull: false,
        onDelete: 'CASCADE', // Ensure that responses are deleted if the user is deleted
      },
      interview_question_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'InterviewQuestions',
          key: 'id',
        },
        allowNull: false,
        onDelete: 'CASCADE', // Ensure that responses are deleted if the interview question is deleted
      },
      transcription_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Transcriptions',
          key: 'id',
        },
        allowNull: true, // Nullable in case transcription is not available
        onDelete: 'SET NULL', // Set to null if the associated transcription is deleted
      },
      audio_upload_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'AudioUploads',
          key: 'id',
        },
        allowNull: true, // Nullable in case no audio is uploaded
        onDelete: 'SET NULL', // Set to null if the associated audio upload is deleted
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('InterviewResponses');
  }
};
