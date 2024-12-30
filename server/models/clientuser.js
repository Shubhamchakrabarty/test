// models/clientUser.js
module.exports = (sequelize, DataTypes) => {
    const ClientUser = sequelize.define('ClientUser', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      client_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Clients',
          key: 'id',
        },
        allowNull: false,
      },
      user_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      designation: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      phone_number: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    }, {
      tableName: 'ClientUsers',
      timestamps: true, // Enable automatic timestamps for createdAt and updatedAt
    });
  
    ClientUser.associate = (models) => {
      ClientUser.belongsTo(models.Client, {
        foreignKey: 'client_id',
        as: 'client',
      });
      ClientUser.hasMany(models.Interview, {
        foreignKey: 'client_user_id',
        as: 'interviews',
      });
      ClientUser.hasMany(models.Question, {
        foreignKey: 'client_user_id',
        as: 'questions',
      });
    };
  
    return ClientUser;
  };