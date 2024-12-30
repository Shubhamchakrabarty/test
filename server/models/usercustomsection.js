// models/usercustomsection.js
module.exports = (sequelize, DataTypes) => {
    const UserCustomSection = sequelize.define('UserCustomSection', {
      user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
        allowNull: false,
      },
      section_title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      details: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    });
  
    return UserCustomSection;
  };