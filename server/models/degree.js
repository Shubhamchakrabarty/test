// models/degree.js
module.exports = (sequelize, DataTypes) => {
    const Degree = sequelize.define('Degree', {
      course: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });

    Degree.associate = (models) => {
      Degree.hasMany(models.Education, {
        foreignKey: 'degree_id',
      });
    };
    return Degree;
  };