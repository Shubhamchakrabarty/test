'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Remove the `length_of_answer` column from `AnswerAudioUploads`
    await queryInterface.removeColumn('AnswerAudioUploads', 'lenght_of_answer');
  },

  async down (queryInterface, Sequelize) {
    // Re-add the `length_of_answer` column to `AnswerAudioUploads` (if necessary for rollback)
    await queryInterface.addColumn('AnswerAudioUploads', 'length_of_answer', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  }
};
