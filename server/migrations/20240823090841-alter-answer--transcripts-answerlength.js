'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Add the `length_of_answer` column to `AnswerTranscripts`
    await queryInterface.addColumn('AnswerTranscripts', 'length_of_answer', {
      type: Sequelize.INTEGER,
      allowNull: true, // This can be null if not recorded
    });
  },

  async down (queryInterface, Sequelize) {
    // Remove the `length_of_answer` column from `AnswerTranscripts` (if necessary for rollback)
    await queryInterface.removeColumn('AnswerTranscripts', 'length_of_answer');
  }
};
