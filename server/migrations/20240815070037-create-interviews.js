'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Interviews', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      client_user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'ClientUsers',
          key: 'id',
        },
        allowNull: false,
      },
      interview_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      interview_time_limit: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      time_limit_per_answer: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM,
        values: ['Draft', 'Published', 'Archived'],
        defaultValue: 'Draft',
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Interviews');
  }
};
