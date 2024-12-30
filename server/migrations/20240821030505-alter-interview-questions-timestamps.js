'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Remove the old underscored columns
    await queryInterface.removeColumn('InterviewQuestions', 'created_at');
    await queryInterface.removeColumn('InterviewQuestions', 'updated_at');

    // Add the new Sequelize auto-managed timestamp columns
    await queryInterface.addColumn('InterviewQuestions', 'createdAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    });

    await queryInterface.addColumn('InterviewQuestions', 'updatedAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    });
  },

  async down (queryInterface, Sequelize) {
    // Reverse the migration - Add the old columns back and drop the new ones
    await queryInterface.addColumn('InterviewQuestions', 'created_at', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    });

    await queryInterface.addColumn('InterviewQuestions', 'updated_at', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    });

    await queryInterface.removeColumn('InterviewQuestions', 'createdAt');
    await queryInterface.removeColumn('InterviewQuestions', 'updatedAt');
  }
};
