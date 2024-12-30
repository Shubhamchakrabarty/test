'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('UserHobbies', {
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
      hobby_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Hobbies',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: false,
      },
      hobby_category_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'HobbyCategories',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: false,
      },
      achievements: {
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

    await queryInterface.addConstraint('UserHobbies', {
      fields: ['user_id', 'hobby_id', 'hobby_category_id'],
      type: 'unique',
      name: 'unique_user_hobby_category'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('UserHobbies', 'unique_user_hobby_category');
    await queryInterface.dropTable('UserHobbies');
  }
};
