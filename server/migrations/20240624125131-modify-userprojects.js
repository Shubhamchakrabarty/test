'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Add a column for project_level_id
    await queryInterface.addColumn('UserProjects', 'project_level_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'ProjectLevels',
        key: 'id',
      },
      allowNull: false,
    });

    // Remove the column for project_type
    await queryInterface.removeColumn('UserProjects', 'project_type');
  },

  async down (queryInterface, Sequelize) {
    // Add back the column for project_type
    await queryInterface.addColumn('UserProjects', 'project_type', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    // Remove the column for project_level_id
    await queryInterface.removeColumn('UserProjects', 'project_level_id');
  }
};
