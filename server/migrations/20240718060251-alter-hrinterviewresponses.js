'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('HrInterviewResponses', 'response', {
      type: Sequelize.TEXT,
      allowNull: false,
    });
    await queryInterface.addColumn('HrInterviewResponses', 'name', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('HrInterviewResponses', 'email', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('HrInterviewResponses', 'formTitle', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('HrInterviewResponses', 'formId', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('HrInterviewResponses', 'response', {
      type: Sequelize.JSONB,
      allowNull: false,
    });
    await queryInterface.removeColumn('HrInterviewResponses', 'name');
    await queryInterface.removeColumn('HrInterviewResponses', 'email');
    await queryInterface.removeColumn('HrInterviewResponses', 'formTitle');
    await queryInterface.removeColumn('HrInterviewResponses', 'formId');
  }
};
