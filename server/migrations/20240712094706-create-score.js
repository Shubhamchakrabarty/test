'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Scores', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      education_score: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
      internships_score: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
      work_experience_score: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
      projects_score: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
      education_weight: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 1.0
      },
      internships_weight: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 1.0
      },
      work_experience_weight: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 1.0
      },
      projects_weight: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 1.0
      },
      final_score: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now')
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Scores');
  }
};
