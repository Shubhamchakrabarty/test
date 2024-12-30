'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('InterviewInstructions', 'language', {
      type: Sequelize.ENUM('en-IN', 'hi'),  // Add ENUM for 'en-IN' and 'hi'
      allowNull: false,
      defaultValue: 'en-IN',  // Default to English (Indian)
    });
  },

  async down (queryInterface, Sequelize) {
    // Before removing an ENUM, we must first drop the column
    await queryInterface.removeColumn('InterviewInstructions', 'language');
    // This removes the ENUM type from the database
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_InterviewInstructions_language";');
  }
};
