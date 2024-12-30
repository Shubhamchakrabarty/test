// models/language.js
module.exports = (sequelize, DataTypes) => {
    const Language = sequelize.define('Language', {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });
    return Language;
  };