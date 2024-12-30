const { Sequelize } = require('sequelize');
const config = require('../config/config')['test']; // Change to 'test'

console.log('Test Database Configuration:');
console.log('Database:', config.database);
console.log('Username:', config.username);
console.log('Host:', config.host);
console.log('Port:', config.port);

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  port: config.port,
  dialect: config.dialect,
  dialectOptions: {
    ssl: config.dialectOptions.ssl, // Use SSL options from the config
  },
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to the test database has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the test database:', error);
  } finally {
    await sequelize.close();
  }
})();