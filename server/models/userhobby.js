// models/userhobby.js
module.exports = (sequelize, DataTypes) => {
    const UserHobby = sequelize.define('UserHobby', {
      user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
        allowNull: false,
      },
      hobby_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Hobbies',
          key: 'id',
        },
        allowNull: false,
      },
      hobby_category_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'HobbyCategories',
          key: 'id',
        },
        allowNull: false,
      },
      achievements: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    }, {
      indexes: [
        {
          unique: true,
          fields: ['user_id', 'hobby_id', 'hobby_category_id']
        }
      ]
    });
  
    return UserHobby;
  };