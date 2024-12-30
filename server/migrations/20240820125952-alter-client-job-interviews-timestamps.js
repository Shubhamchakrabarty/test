'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Remove the old underscored columns
    await queryInterface.removeColumn('ClientJobInterviews', 'created_at');
    await queryInterface.removeColumn('ClientJobInterviews', 'updated_at');

    // Add the new Sequelize auto-managed timestamp columns
    await queryInterface.addColumn('ClientJobInterviews', 'createdAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    });

    await queryInterface.addColumn('ClientJobInterviews', 'updatedAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    });
  },

  async down (queryInterface, Sequelize) {
    // Reverse the migration - Add the old columns back and drop the new ones
    await queryInterface.addColumn('ClientJobInterviews', 'created_at', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    });

    await queryInterface.addColumn('ClientJobInterviews', 'updated_at', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    });

    await queryInterface.removeColumn('ClientJobInterviews', 'createdAt');
    await queryInterface.removeColumn('ClientJobInterviews', 'updatedAt');
  }
};
