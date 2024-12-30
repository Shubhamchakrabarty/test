'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('UserProjects', 'start_date', {
      type: Sequelize.DATE,
      allowNull: true, // Change this to true to make it optional
    });

    await queryInterface.changeColumn('UserProjects', 'end_date', {
      type: Sequelize.DATE,
      allowNull: true, // Change this to true to make it optional
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('UserProjects', 'start_date', {
      type: Sequelize.DATE,
      allowNull: false, // Revert this to false to make it mandatory again
    });

    await queryInterface.changeColumn('UserProjects', 'end_date', {
      type: Sequelize.DATE,
      allowNull: false, // Revert this to false to make it mandatory again
    });
  }
};
