'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Add new enum values
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_UserJobs_status" ADD VALUE 'CV Matched';
      ALTER TYPE "enum_UserJobs_status" ADD VALUE 'CV Partially Matched';
      ALTER TYPE "enum_UserJobs_status" ADD VALUE 'CV Not Matched';
    `);
  },

  async down (queryInterface, Sequelize) {
    // Revert back to original ENUM values
   // Enum values can't be removed in PostgreSQL directly, so this down method will handle rollback by recreating the enum
    // You can only drop the enum and recreate without the new values if necessary
    await queryInterface.sequelize.query(`
      CREATE TYPE "enum_UserJobs_status_old" AS ENUM('Applied', 'Eligible', 'Not Eligible', 'Rejected', 'Accepted');
      ALTER TABLE "UserJobs" ALTER COLUMN "status" TYPE "enum_UserJobs_status_old" USING "status"::text::"enum_UserJobs_status_old";
      DROP TYPE "enum_UserJobs_status";
      ALTER TYPE "enum_UserJobs_status_old" RENAME TO "enum_UserJobs_status";
    `);
  }
};
