'use strict';

const fs = require('fs');
const path = require('path');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const filePath = path.join(__dirname, '..', 'csvdata', 'degrees.json');
    const degrees = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    await queryInterface.bulkInsert('Degrees', degrees, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Degrees', null, {});
  }
};
