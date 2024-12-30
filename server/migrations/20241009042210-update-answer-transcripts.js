'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('AnswerTranscripts');

    // Update answer_audio_upload_id to allow null
    if (tableDescription.answer_audio_upload_id) {

      await queryInterface.changeColumn('AnswerTranscripts', 'answer_audio_upload_id', {
        type: Sequelize.INTEGER,
        references: {
          model: 'AnswerAudioUploads',
          key: 'id',
        },
        allowNull: true, // Made nullable to support text responses
      });
    }

    // Add answer_text_upload_id if it does not exist
    if (!tableDescription.answer_text_upload_id) {
      await queryInterface.addColumn('AnswerTranscripts', 'answer_text_upload_id', {
        type: Sequelize.INTEGER,
        references: {
          model: 'AnswerTextUploads',
          key: 'id',
        },
        allowNull: true,
      });
    }

    // Rename length_of_answer to time_taken_to_answer if length_of_answer exists
    if (tableDescription.length_of_answer) {
      await queryInterface.renameColumn('AnswerTranscripts', 'length_of_answer', 'time_taken_to_answer');
    }

    // Add response_type if it does not exist
    if (!tableDescription.response_type) {
      await queryInterface.addColumn('AnswerTranscripts', 'response_type', {
        type: Sequelize.ENUM('audio', 'text', 'video'),
        allowNull: false,
        defaultValue: 'audio', // Set default to 'audio' to handle existing null values
      });
    }
  },

  async down (queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('AnswerTranscripts');

    // Revert answer_audio_upload_id to not allow null
    if (tableDescription.answer_audio_upload_id) {
      await queryInterface.changeColumn('AnswerTranscripts', 'answer_audio_upload_id', {
        type: Sequelize.INTEGER,
        references: {
          model: 'AnswerAudioUploads',
          key: 'id',
        },
        allowNull: false, // Revert to not nullable
      });
    }

    // Remove answer_text_upload_id if it exists
    if (tableDescription.answer_text_upload_id) {
      await queryInterface.removeColumn('AnswerTranscripts', 'answer_text_upload_id');
    }

    // Rename time_taken_to_answer back to length_of_answer if it exists
    if (tableDescription.time_taken_to_answer) {
      await queryInterface.renameColumn('AnswerTranscripts', 'time_taken_to_answer', 'length_of_answer');
    }

    // Remove response_type if it exists
    if (tableDescription.response_type) {
      await queryInterface.removeColumn('AnswerTranscripts', 'response_type');
    }
  }
};
