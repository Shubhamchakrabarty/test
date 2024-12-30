// models/userskill.js
module.exports = (sequelize, DataTypes) => {
    const UserSkill = sequelize.define('UserSkill', {
      user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
        allowNull: false,
      },
      skill_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Skills',
          key: 'id',
        },
        allowNull: false,
      },
      skill_rating_user: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 5,
        },
      },
      skill_rating_pehchan: {
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
          fields: ['user_id', 'skill_id']
        }
      ]
    });
  
    return UserSkill;
  };