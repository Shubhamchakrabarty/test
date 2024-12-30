// models/questionEvaluationCriteria.js
module.exports = (sequelize, DataTypes) => {
    const QuestionEvaluationCriteria = sequelize.define('QuestionEvaluationCriteria', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      interview_question_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'InterviewQuestion',
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
      priority: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      instructions: {
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
      tableName: 'QuestionEvaluationCriteria',
      timestamps: true,
    });
  
    QuestionEvaluationCriteria.associate = (models) => {
      QuestionEvaluationCriteria.belongsTo(models.InterviewQuestion, {
        foreignKey: 'interview_question_id',
        as: 'interview_question',
      });
      QuestionEvaluationCriteria.belongsTo(models.JobInterviewEvaluationCategory, {
        foreignKey: 'evaluation_category_id',
        as: 'evaluation_category',
      });
    };
  
    return QuestionEvaluationCriteria;
  };
  