// models/referenceAnswer.js
module.exports = (sequelize, DataTypes) => {
    const ReferenceAnswer = sequelize.define('ReferenceAnswer', {
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
      evaluation_category_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'JobInterviewEvaluationCategories',
          key: 'id',
        },
        allowNull: false,
        onDelete: 'CASCADE',
      },
      answer: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      score: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    }, {
      tableName: 'ReferenceAnswers',
      timestamps: true,
    });
  
    ReferenceAnswer.associate = (models) => {
      ReferenceAnswer.belongsTo(models.InterviewQuestion, {
        foreignKey: 'interview_question_id',
        as: 'interview_question',
      });
      ReferenceAnswer.belongsTo(models.JobInterviewEvaluationCategory, {
        foreignKey: 'evaluation_category_id',
        as: 'evaluation_category',
      });
    };
  
    return ReferenceAnswer;
  };
  