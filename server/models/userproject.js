// models/userproject.js
module.exports = (sequelize, DataTypes) => {
    const UserProject = sequelize.define('UserProject', {
      user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
        allowNull: false,
      },
      project_level_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'ProjectLevels',
          key: 'id',
        },
        allowNull: false,
      },
      project_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      start_date: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      end_date: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      project_summary: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    });
    UserProject.associate = (models) => {
      UserProject.belongsTo(models.Users, {
        foreignKey: 'user_id',
      });
      UserProject.belongsTo(models.ProjectLevel, {
        foreignKey: 'project_level_id',
      });
    };
  
    return UserProject;
  };