'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Remove client_id column
    await queryInterface.removeColumn('ClientJobs', 'client_id');
    // Add client_user_id column
    await queryInterface.addColumn('ClientJobs', 'client_user_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'ClientUsers',
        key: 'id',
      },
      allowNull: false,
      onDelete: 'CASCADE',
    });
  },

  async down (queryInterface, Sequelize) {
    // Add client_id column back
    await queryInterface.addColumn('ClientJobs', 'client_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Clients',
        key: 'id',
      },
      allowNull: false,
      onDelete: 'CASCADE',
    });

    // Remove client_user_id column
    await queryInterface.removeColumn('ClientJobs', 'client_user_id');
  }
};
