'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('UserProjects', 'start_date', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.changeColumn('UserProjects', 'end_date', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('UserProjects', 'start_date', {
      type: Sequelize.DATE,
      allowNull: false,
    });
    await queryInterface.changeColumn('UserProjects', 'end_date', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  }
};
