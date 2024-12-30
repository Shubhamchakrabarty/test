'use strict';

const fs = require('fs');
const path = require('path'); // Import the path module

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const filePath = path.join(__dirname, '..', 'csvdata', 'hobbycategories.json');
    const hobbyCategories = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    await queryInterface.bulkInsert('HobbyCategories', hobbyCategories, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('HobbyCategories', null, {});
  }
};
