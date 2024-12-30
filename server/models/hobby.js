// models/hobby.js
module.exports = (sequelize, DataTypes) => {
    const Hobby = sequelize.define('Hobby', {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      category_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'HobbyCategories',
          key: 'id',
        },
        allowNull: false,
      },
    });
    return Hobby;
  };