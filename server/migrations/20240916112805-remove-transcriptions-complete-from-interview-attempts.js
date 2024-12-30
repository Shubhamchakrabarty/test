'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('UserClientJobInterviewAttempts', 'transcriptions_complete');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('UserClientJobInterviewAttempts', 'transcriptions_complete', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  }
};
