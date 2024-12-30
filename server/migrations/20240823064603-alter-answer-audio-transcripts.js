'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Remove the old underscored columns
    await queryInterface.removeColumn('AnswerTranscripts', 'created_at');
    await queryInterface.removeColumn('AnswerTranscripts', 'updated_at');

    // Add the new Sequelize auto-managed timestamp columns
    await queryInterface.addColumn('AnswerTranscripts', 'createdAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    });

    await queryInterface.addColumn('AnswerTranscripts', 'updatedAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    });
  },

  async down (queryInterface, Sequelize) {
    // Reverse the migration - Add the old columns back and drop the new ones
    await queryInterface.addColumn('AnswerTranscripts', 'created_at', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    });

    await queryInterface.addColumn('AnswerTranscripts', 'updated_at', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    });

    await queryInterface.removeColumn('AnswerTranscripts', 'createdAt');
    await queryInterface.removeColumn('AnswerTranscripts', 'updatedAt');
  }
};
