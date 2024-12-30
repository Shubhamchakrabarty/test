'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('NotificationTemplates', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      emailTemplate: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      notification_channel: {
        type: Sequelize.ENUM('Email', 'SMS', 'Whatsapp'),
        allowNull: false,
      },
      notification_use_case_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'NotificationUseCases', // Reference to the NotificationUseCases table
          key: 'id',
        },
        onDelete: 'CASCADE', // Optional: define the delete behavior
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('NotificationTemplates');
  }
};
