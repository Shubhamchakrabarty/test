// models/userextracurricular.js
module.exports = (sequelize, DataTypes) => {
    const UserExtraCurricular = sequelize.define('UserExtraCurricular', {
      user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
        allowNull: false,
      },
      extracurricular_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'ExtraCurriculars',
          key: 'id',
        },
        allowNull: false,
      },
      extracurricular_category_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'ExtraCurricularCategories',
          key: 'id',
        },
        allowNull: false,
      },
      achievement: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    }, {
      tableName: 'UserExtracurriculars', // Add this line to specify the table name
      indexes: [
        {
          unique: true,
          fields: ['user_id', 'extracurricular_id', 'extracurricular_category_id']
        }
      ]
    });
  
    return UserExtraCurricular;
  };