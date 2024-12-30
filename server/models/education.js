// models/education.js
module.exports = (sequelize, DataTypes) => {
    const Education = sequelize.define('Education', {
      user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
        allowNull: false,
      },
      university_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Universities',
          key: 'id',
        },
        allowNull: false,
      },
      degree_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Degrees',
          key: 'id',
        },
        allowNull: false,
      },
      cgpa: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          min: 0.0,
          max: 100.0,
        },
      },
      start_date: {
        type: DataTypes.STRING,
        allowNull: true, // Make start_date optional
      },
      end_date: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      major: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    }, {
      tableName: 'Educations', // Specify the correct table name
    }
  );
  Education.associate = (models) => {
    Education.belongsTo(models.Users, {
      foreignKey: 'user_id',
    });
    Education.belongsTo(models.University, {
      foreignKey: 'university_id',
    });
    Education.belongsTo(models.Degree, {
      foreignKey: 'degree_id',
    });
  };
    return Education;
  };