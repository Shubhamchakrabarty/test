// models/userjob.js
module.exports = (sequelize, DataTypes) => {
    const UserJob = sequelize.define('UserJob', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
        allowNull: false,
      },
      job_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'ClientJobs',
          key: 'id',
        },
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM,
        values: ['Applied', 'Eligible', 'Not Eligible', 'Rejected', 'Accepted', 'CV Matched', 'CV Partially Matched', 'CV Not Matched'],
        defaultValue: 'Eligible',
        allowNull: false,
      },
    }, {
      tableName: 'UserJobs',
      timestamps: true,
    });
  
    UserJob.associate = (models) => {
      UserJob.belongsTo(models.Users, {
        foreignKey: 'user_id',
        as: 'user',
      });
      UserJob.belongsTo(models.ClientJob, {
        foreignKey: 'job_id',
        as: 'job',
      });
    };
  
    return UserJob;
  };
  