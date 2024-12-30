'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Remove the old underscored columns
    await queryInterface.removeColumn('ClientJobs', 'created_at');
    await queryInterface.removeColumn('ClientJobs', 'updated_at');

    // Add the new Sequelize auto-managed timestamp columns
    await queryInterface.addColumn('ClientJobs', 'createdAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    });

    await queryInterface.addColumn('ClientJobs', 'updatedAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    });
  },

  async down (queryInterface, Sequelize) {
    // Reverse the migration - Add the old columns back and drop the new ones
    await queryInterface.addColumn('ClientJobs', 'created_at', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    });

    await queryInterface.addColumn('ClientJobs', 'updated_at', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    });

    await queryInterface.removeColumn('ClientJobs', 'createdAt');
    await queryInterface.removeColumn('ClientJobs', 'updatedAt');
  }
};
