// models/interviewResponse.js
module.exports = (sequelize, DataTypes) => {
    const InterviewResponse = sequelize.define('InterviewResponse', {
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
      user_client_job_interview_attempt_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'UserClientJobInterviewAttempts',
          key: 'id',
        },
        allowNull: false,
        onDelete: 'CASCADE',
      },
      interview_question_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'InterviewQuestions',
          key: 'id',
        },
        allowNull: false,
      },
      follow_up_question_id: { // New field to link to follow-up questions
        type: DataTypes.INTEGER,
        references: {
          model: 'FollowUpQuestions',
          key: 'id',
        },
        allowNull: true, // Nullable because not all responses will be follow-ups
      },
      answer_transcription_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'AnswerTranscripts',
          key: 'id',
        },
        allowNull: true, // Nullable in case transcription is not available
      },
    }, {
      tableName: 'InterviewResponses',
      timestamps: true,
    });
  
    InterviewResponse.associate = (models) => {
      InterviewResponse.belongsTo(models.Users, { foreignKey: 'user_id', as: 'user' });
      InterviewResponse.belongsTo(models.UserClientJobInterviewAttempt, { foreignKey: 'user_client_job_interview_attempt_id', as: 'user_client_job_interview_attempt' });
      InterviewResponse.belongsTo(models.InterviewQuestion, { foreignKey: 'interview_question_id', as: 'interview_question' });
      InterviewResponse.belongsTo(models.AnswerTranscript, { foreignKey: 'answer_transcription_id', as: 'answer_transcription' });
    };
  
    return InterviewResponse;
  };
  