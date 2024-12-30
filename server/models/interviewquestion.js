// models/interviewQuestion.js
module.exports = (sequelize, DataTypes) => {
    const InterviewQuestion = sequelize.define('InterviewQuestion', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      interview_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Interviews',
          key: 'id',
        },
        allowNull: false,
      },
      question_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Questions',
          key: 'id',
        },
        allowNull: false,
      },
      question_order: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      question_set: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false,
      }
    }, {
      tableName: 'InterviewQuestions',
      timestamps: true, // Enable automatic timestamps for createdAt and updatedAt
    });
  
    InterviewQuestion.associate = (models) => {
      InterviewQuestion.belongsTo(models.Interview, {
        foreignKey: 'interview_id',
        as: 'interview',
      });
      InterviewQuestion.belongsTo(models.Question, {
        foreignKey: 'question_id',
        as: 'question',
      });
      InterviewQuestion.hasMany(models.ReferenceAnswer, {
        foreignKey: 'interview_question_id',
        as: 'reference_answers',
        onDelete: 'CASCADE',
      });
    };
  
    return InterviewQuestion;
  };
  