'use strict';

const fs = require('fs');
const path = require('path'); // Add this line to import the path module

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const filePath = path.join(__dirname, '..', 'csvdata', 'designations.json');
    const designations = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    await queryInterface.bulkInsert('Designations', designations, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Designations', null, {});
  }
};
