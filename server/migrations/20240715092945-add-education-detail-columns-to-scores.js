'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Scores', 'school_1_score', {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 0
    });
    await queryInterface.addColumn('Scores', 'school_2_score', {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 0
    });
    await queryInterface.addColumn('Scores', 'undergrad_university_score', {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 0
    });
    await queryInterface.addColumn('Scores', 'undergrad_cgpa_score', {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 0
    });
    await queryInterface.addColumn('Scores', 'postgrad_university_score', {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 0
    });
    await queryInterface.addColumn('Scores', 'postgrad_cgpa_score', {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 0
    });

    await queryInterface.addColumn('Scores', 'school_1_weight', {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 1.0
    });
    await queryInterface.addColumn('Scores', 'school_2_weight', {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 1.0
    });
    await queryInterface.addColumn('Scores', 'undergrad_university_weight', {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 1.0
    });
    await queryInterface.addColumn('Scores', 'undergrad_cgpa_weight', {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 1.0
    });
    await queryInterface.addColumn('Scores', 'postgrad_university_weight', {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 1.0
    });
    await queryInterface.addColumn('Scores', 'postgrad_cgpa_weight', {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 1.0
    });

    // Remove old columns if necessary
    await queryInterface.removeColumn('Scores', 'education_score');
    await queryInterface.removeColumn('Scores', 'education_weight');

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Scores', 'school_1_score');
    await queryInterface.removeColumn('Scores', 'school_2_score');
    await queryInterface.removeColumn('Scores', 'undergrad_university_score');
    await queryInterface.removeColumn('Scores', 'undergrad_cgpa_score');
    await queryInterface.removeColumn('Scores', 'postgrad_university_score');
    await queryInterface.removeColumn('Scores', 'postgrad_cgpa_score');

    await queryInterface.removeColumn('Scores', 'school_1_weight');
    await queryInterface.removeColumn('Scores', 'school_2_weight');
    await queryInterface.removeColumn('Scores', 'undergrad_university_weight');
    await queryInterface.removeColumn('Scores', 'undergrad_cgpa_weight');
    await queryInterface.removeColumn('Scores', 'postgrad_university_weight');
    await queryInterface.removeColumn('Scores', 'postgrad_cgpa_weight');

    // Add back the old columns if necessary
    await queryInterface.addColumn('Scores', 'education_score', {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 0
    });
    await queryInterface.addColumn('Scores', 'education_weight', {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 1.0
    });
  }
};
