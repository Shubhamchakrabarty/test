'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('AnswerTranscripts', 'pronunciation_accuracy', {
      type: Sequelize.FLOAT,
      allowNull: true,
    });
    await queryInterface.addColumn('AnswerTranscripts', 'fluency_wpm', {
      type: Sequelize.FLOAT,
      allowNull: true,
    });
    await queryInterface.addColumn('AnswerTranscripts', 'fluency_pauses', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.addColumn('AnswerTranscripts', 'fluency_long_pauses', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.addColumn('AnswerTranscripts', 'clarity_score', {
      type: Sequelize.FLOAT,
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('AnswerTranscripts', 'pronunciation_accuracy');
    await queryInterface.removeColumn('AnswerTranscripts', 'fluency_wpm');
    await queryInterface.removeColumn('AnswerTranscripts', 'fluency_pauses');
    await queryInterface.removeColumn('AnswerTranscripts', 'fluency_long_pauses');
    await queryInterface.removeColumn('AnswerTranscripts', 'clarity_score');
  }
};
