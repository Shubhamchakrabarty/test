'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('HrInterviewScores', 'logicalReasoning', {
      type: Sequelize.JSONB,
      allowNull: true,
    });
    await queryInterface.addColumn('HrInterviewScores', 'logicalReasoningScore', {
      type: Sequelize.FLOAT,
      allowNull: true,
      defaultValue: 0.0,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('HrInterviewScores', 'logicalReasoning');
    await queryInterface.removeColumn('HrInterviewScores', 'logicalReasoningScore');
  }
};
