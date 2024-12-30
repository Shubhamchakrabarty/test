module.exports = (sequelize, DataTypes) => {
    const HobbyCategory = sequelize.define('HobbyCategory', {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });
    return HobbyCategory;
  };