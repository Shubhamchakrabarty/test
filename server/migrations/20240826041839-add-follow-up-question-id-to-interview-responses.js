'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('InterviewResponses', 'follow_up_question_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'FollowUpQuestions',
        key: 'id',
      },
      allowNull: true, // Nullable because not all responses will be follow-ups
      onDelete: 'SET NULL',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('InterviewResponses', 'follow_up_question_id');
  }
};
