'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Remove the old underscored columns
    await queryInterface.removeColumn('AnswerAudioUploads', 'created_at');
    await queryInterface.removeColumn('AnswerAudioUploads', 'updated_at');

    await queryInterface.renameColumn('AnswerAudioUploads', 'duration', 'time_taken_to_answer');
    await queryInterface.addColumn('AnswerAudioUploads', 'lenght_of_answer', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.addColumn('AnswerAudioUploads', 'createdAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    });
    await queryInterface.addColumn('AnswerAudioUploads', 'updatedAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.renameColumn('AnswerAudioUploads', 'time_taken_to_answer', 'duration');
    await queryInterface.removeColumn('AnswerAudioUploads', 'length_of_answer');
    await queryInterface.removeColumn('AnswerAudioUploads', 'createdAt');
    await queryInterface.removeColumn('AnswerAudioUploads', 'updatedAt');
    await queryInterface.addColumn('AnswerAudioUploads', 'created_at', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    });

    await queryInterface.addColumn('AnswerAudioUploads', 'updated_at', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    });
  }
};
