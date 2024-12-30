'use strict';

const fs = require('fs');
const path = require('path');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const filePath = path.join(__dirname, '..', 'csvdata', 'universities.json');
    const universities = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    await queryInterface.bulkInsert('Universities', universities, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Universities', null, {});
  }
};
