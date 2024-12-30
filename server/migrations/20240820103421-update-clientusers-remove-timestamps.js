'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('ClientUsers', 'created_at');
    await queryInterface.removeColumn('ClientUsers', 'updated_at');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('ClientUsers', 'created_at', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn('NOW'),
    });
    await queryInterface.addColumn('ClientUsers', 'updated_at', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn('NOW'),
    });
  }
};
