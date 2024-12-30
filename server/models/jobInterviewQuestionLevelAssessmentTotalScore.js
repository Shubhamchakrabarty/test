// models/JobInterviewQuestionLevelAssessmentTotalScore.js
module.exports = (sequelize, DataTypes) => {
    const JobInterviewQuestionLevelAssessmentTotalScore = sequelize.define('JobInterviewQuestionLevelAssessmentTotalScore', {
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
      total_score: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
      },
    }, {
      tableName: 'JobInterviewQuestionLevelAssessmentTotalScores',
      timestamps: true,
    });
  
    JobInterviewQuestionLevelAssessmentTotalScore.associate = (models) => {
      JobInterviewQuestionLevelAssessmentTotalScore.belongsTo(models.UserClientJobInterviewAttempt, {
        foreignKey: 'user_client_job_interview_attempt_id',
        as: 'user_client_job_interview_attempt',
      });
      JobInterviewQuestionLevelAssessmentTotalScore.belongsTo(models.JobInterviewEvaluationCategory, {
        foreignKey: 'evaluation_category_id',
        as: 'evaluation_category',
      });
    };
  
    return JobInterviewQuestionLevelAssessmentTotalScore;
  };
  