'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('UserExtracurriculars', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: false,
      },
      extracurricular_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Extracurriculars',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: false,
      },
      extracurricular_category_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'ExtracurricularCategories',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: false,
      },
      achievement: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.addConstraint('UserExtracurriculars', {
      fields: ['user_id', 'extracurricular_id', 'extracurricular_category_id'],
      type: 'unique',
      name: 'unique_user_extracurricular_category'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('UserExtracurriculars', 'unique_user_extracurricular_category');
    await queryInterface.dropTable('UserExtracurriculars');
  }
};
