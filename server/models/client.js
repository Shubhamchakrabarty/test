// models/client.js
module.exports = (sequelize, DataTypes) => {
    const Client = sequelize.define('Client', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      contact_information: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    }, {
      tableName: 'Clients',
      timestamps: true, // Enable automatic timestamps for createdAt and updatedAt
    });
  
    Client.associate = (models) => {
      Client.hasMany(models.ClientUser, {
        foreignKey: 'client_id',
        as: 'client_users',
      });
    };
  
    return Client;
  };
  