// models/projectlevel.js
module.exports = (sequelize, DataTypes) => {
    const ProjectLevel = sequelize.define('ProjectLevel', {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });
    ProjectLevel.associate = (models) => {
      ProjectLevel.hasMany(models.UserProject, {
        foreignKey: 'project_level_id',
      });
    };
    return ProjectLevel;
  };