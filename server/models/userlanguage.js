// models/userlanguage.js
module.exports = (sequelize, DataTypes) => {
    const UserLanguage = sequelize.define('UserLanguage', {
      user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
        allowNull: false,
      },
      language_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Languages',
          key: 'id',
        },
        allowNull: false,
      },
      language_proficiency_user: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 5,
        },
      },
      language_proficiency_pehchan: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          min: 1,
          max: 5,
        },
      },
    }, {
      indexes: [
        {
          unique: true,
          fields: ['user_id', 'language_id']
        }
      ]
    });
  
    return UserLanguage;
  };