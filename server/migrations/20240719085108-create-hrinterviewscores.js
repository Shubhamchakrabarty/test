'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('HrInterviewScores', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      responseId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'HrInterviewResponses',
          key: 'id',
        },
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
        allowNull: false,
      },
      interviewName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      functionalSkills: {
        type: Sequelize.JSONB,
        allowNull: true, // Allow nullable
      },
      communication: {
        type: Sequelize.JSONB,
        allowNull: true, // Allow nullable
      },
      personalityTraits: {
        type: Sequelize.JSONB,
        allowNull: true, // Allow nullable
      },
      functionalSkillsScore: {
        type: Sequelize.FLOAT,
        allowNull: true, // Allow nullable
        defaultValue: 0.0,
      },
      communicationScore: {
        type: Sequelize.FLOAT,
        allowNull: true, // Allow nullable
        defaultValue: 0.0,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('HrInterviewScores');
  }
};
