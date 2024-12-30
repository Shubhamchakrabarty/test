const csv = require('csvtojson');
const fs = require('fs');
const path = require('path');

const csvFilePath = path.join(__dirname, '..', 'csvdata', 'internshipDesignations.csv');
const jsonFilePath = path.join(__dirname, '..', 'csvdata', 'internshipDesignations.json');

csv()
  .fromFile(csvFilePath)
  .then((jsonObj) => {
    fs.writeFileSync(jsonFilePath, JSON.stringify(jsonObj, null, 2));
    console.log('CSV file has been converted to JSON successfully.');
  });