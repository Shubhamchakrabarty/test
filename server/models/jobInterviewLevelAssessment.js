// models/JobInterviewLevelAssessment.js
module.exports = (sequelize, DataTypes) => {
    const JobInterviewLevelAssessment = sequelize.define('JobInterviewLevelAssessment', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      user_client_job_interview_attempt_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'UserClientJobInterviewAttempts',
          key: 'id',
        },
        allowNull: false,
        onDelete: 'CASCADE',
      },
      evaluation_category_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'JobInterviewEvaluationCategories',
          key: 'id',
        },
        allowNull: false,
      },
      score: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
      },
      feedback: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    }, {
      tableName: 'JobInterviewLevelAssessments',
      timestamps: true,
    });
  
    JobInterviewLevelAssessment.associate = (models) => {
      JobInterviewLevelAssessment.belongsTo(models.UserClientJobInterviewAttempt, {
        foreignKey: 'user_client_job_interview_attempt_id',
        as: 'user_client_job_interview_attempt',
      });
      JobInterviewLevelAssessment.belongsTo(models.JobInterviewEvaluationCategory, {
        foreignKey: 'evaluation_category_id',
        as: 'evaluation_category',
      });
    };
  
    return JobInterviewLevelAssessment;
  };
  