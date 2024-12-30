'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('VideoUploads', 'interview_id');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('VideoUploads', 'interview_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Interviews',
        key: 'id',
      },
      allowNull: false,
      onDelete: 'CASCADE',
    });
  },
};
