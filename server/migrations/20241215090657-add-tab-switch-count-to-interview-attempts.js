'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('UserClientJobInterviewAttempts', 'tab_switch_count', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0, // Default value
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('UserClientJobInterviewAttempts', 'tab_switch_count');
  }
};
