// models/interviewQuestionReferenceAnswer.js
module.exports = (sequelize, DataTypes) => {
    const InterviewQuestionReferenceAnswer = sequelize.define('InterviewQuestionReferenceAnswer', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      interview_question_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'InterviewQuestions',
          key: 'id',
        },
        allowNull: false,
        onDelete: 'CASCADE',
      },
      reference_answer_text: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      media_url: {
        type: DataTypes.STRING,
        allowNull: true, // Optional, in case the reference answer includes media
      },
    }, {
      tableName: 'InterviewQuestionReferenceAnswers',
      timestamps: true,
    });
  
    InterviewQuestionReferenceAnswer.associate = (models) => {
      InterviewQuestionReferenceAnswer.belongsTo(models.InterviewQuestion, {
        foreignKey: 'interview_question_id',
        as: 'interview_question',
      });
    };
  
    return InterviewQuestionReferenceAnswer;
  };
  