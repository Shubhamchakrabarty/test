module.exports = (sequelize, DataTypes) => {
    const University = sequelize.define('University', {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });

    University.associate = (models) => {
      University.hasMany(models.Education, {
        foreignKey: 'university_id',
      });
    };

    return University;
  };