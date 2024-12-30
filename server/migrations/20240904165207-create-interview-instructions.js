'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('InterviewInstructions', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      interview_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Interviews',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      pre_interview_instructions: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      welcome_message: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      welcome_video_url: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      context_video_url: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('InterviewInstructions');
  }
};
