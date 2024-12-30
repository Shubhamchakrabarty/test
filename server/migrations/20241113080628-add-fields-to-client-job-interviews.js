'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('ClientJobInterviews', 'question_set_selection_method', {
      type: Sequelize.ENUM,
      values: ['random', 'fixed'],
      defaultValue: 'fixed',
      allowNull: false,
    });

    await queryInterface.addColumn('ClientJobInterviews', 'question_set_fixed', {
      type: Sequelize.INTEGER,
      defaultValue: 1,
      allowNull: false,
    });

    await queryInterface.addColumn('ClientJobInterviews', 'number_of_question_sets', {
      type: Sequelize.INTEGER,
      defaultValue: 1,
      allowNull: false,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('ClientJobInterviews', 'number_of_question_sets');
    await queryInterface.removeColumn('ClientJobInterviews', 'question_set_fixed');
    await queryInterface.removeColumn('ClientJobInterviews', 'question_set_selection_method');
  }
};
