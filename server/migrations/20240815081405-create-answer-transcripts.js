'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('AnswerTranscripts', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      answer_audio_upload_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'AnswerAudioUploads',
          key: 'id',
        },
        allowNull: false,
        onDelete: 'CASCADE',
      },
      transcript: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      service_used: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'Deepgram',
      },
      confidence_score: {
        type: Sequelize.FLOAT,
        allowNull: true,
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
    await queryInterface.dropTable('AnswerTranscripts');
  }
};
