const { Sequelize } = require('sequelize');
const config = require('../config/config')['production'];

console.log('Database Configuration:');
console.log('Database:', config.database);
console.log('Username:', config.username);
console.log('Host:', config.host);
console.log('Port:', config.port);

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  port: config.port,
  dialect: config.dialect,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // If you don't have a CA certificate
    },
  },
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  } finally {
    await sequelize.close();
  }
})();