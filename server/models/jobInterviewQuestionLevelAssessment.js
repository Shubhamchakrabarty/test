module.exports = (sequelize, DataTypes) => {
    const JobInterviewQuestionLevelAssessment = sequelize.define('JobInterviewQuestionLevelAssessment', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      interview_response_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'InterviewResponses',
          key: 'id',
        },
        allowNull: false,
        onDelete: 'CASCADE',
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
      follow_up_question_id: { // Optional link to follow-up questions
        type: DataTypes.INTEGER,
        references: {
          model: 'FollowUpQuestions',
          key: 'id',
        },
        allowNull: true, // Nullable because not all assessments will be for follow-up questions
      },
      score: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
      },
      feedback: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
    }, {
      tableName: 'JobInterviewQuestionLevelAssessments',
      timestamps: true,
    });
  
    JobInterviewQuestionLevelAssessment.associate = (models) => {
        JobInterviewQuestionLevelAssessment.belongsTo(models.InterviewResponse, {
        foreignKey: 'interview_response_id',
        as: 'interview_response',
      });
      JobInterviewQuestionLevelAssessment.belongsTo(models.UserClientJobInterviewAttempt, {
        foreignKey: 'user_client_job_interview_attempt_id',
        as: 'user_client_job_interview_attempt',
      });
      JobInterviewQuestionLevelAssessment.belongsTo(models.JobInterviewEvaluationCategory, {
        foreignKey: 'evaluation_category_id',
        as: 'evaluation_category',
      });
      JobInterviewQuestionLevelAssessment.belongsTo(models.FollowUpQuestion, {
        foreignKey: 'follow_up_question_id',
        as: 'follow_up_question',
      });
    };
  
    return JobInterviewQuestionLevelAssessment;
  };
  