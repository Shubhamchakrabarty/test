'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('CvUploadUserJobs', 'cv_assessment_system', {
      type: Sequelize.TEXT,
      allowNull: true, // retain the same allowNull rule
    });
  },

  async down (queryInterface, Sequelize) {
    /// Revert the data type change back to STRING
    await queryInterface.changeColumn('CvUploadUserJobs', 'cv_assessment_system', {
      type: Sequelize.STRING,
      allowNull: true, // retain the same allowNull rule
    });
  }
};
