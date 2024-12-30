'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('InterviewResponses', 'user_client_job_interview_attempt_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'UserClientJobInterviewAttempts',
        key: 'id',
      },
      allowNull: false,
      onDelete: 'CASCADE',
    });
    await queryInterface.addColumn('InterviewResponses', 'answer_transcription_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'AnswerTranscripts',
        key: 'id',
      },
      allowNull: true,
    });
    await queryInterface.addColumn('InterviewResponses', 'createdAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    });

    await queryInterface.addColumn('InterviewResponses', 'updatedAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    });

    await queryInterface.removeColumn('InterviewResponses', 'audio_upload_id');
    await queryInterface.removeColumn('InterviewResponses', 'transcription_id');
    await queryInterface.removeColumn('InterviewResponses', 'created_at');
    await queryInterface.removeColumn('InterviewResponses', 'updated_at');
  },

  async down (queryInterface, Sequelize) {
    // Revert the changes
    await queryInterface.addColumn('InterviewResponses', 'transcription_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Transcriptions',
        key: 'id',
      },
      allowNull: true,
    });

    await queryInterface.addColumn('InterviewResponses', 'audio_upload_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'AudioUploads',
        key: 'id',
      },
      allowNull: true,
    });

    await queryInterface.addColumn('InterviewResponses', 'created_at', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    });

    await queryInterface.addColumn('InterviewResponses', 'updated_at', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    });

    await queryInterface.removeColumn('InterviewResponses', 'user_client_job_interview_attempt_id');
    await queryInterface.removeColumn('InterviewResponses', 'answer_transcription_id');
    await queryInterface.removeColumn('InterviewResponses', 'createdAt');
    await queryInterface.removeColumn('InterviewResponses', 'updatedAt');
  }
};
