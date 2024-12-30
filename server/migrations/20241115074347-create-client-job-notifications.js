'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ClientJobNotifications', {
      clientJobNotificationId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      clientJobId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'ClientJobs',
          key: 'id',
        },
        allowNull: false,
        onDelete: 'CASCADE',
      },
      notificationId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'NotificationTemplates',
          key: 'id',
        },
        allowNull: false,
        onDelete: 'CASCADE',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ClientJobNotifications');
  }
};
