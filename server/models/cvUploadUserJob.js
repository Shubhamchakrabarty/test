module.exports = (sequelize, DataTypes) => {
    const CvUploadUserJob = sequelize.define('CvUploadUserJob', {
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
      file_url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      parsed_cv: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      cv_assessment_system: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    });
  
    CvUploadUserJob.associate = (models) => {
      CvUploadUserJob.belongsTo(models.Users, { foreignKey: 'user_id', as: 'user' });
      CvUploadUserJob.belongsTo(models.ClientJob, { foreignKey: 'job_id', as: 'job' });
    };
  
    return CvUploadUserJob;
  };
  