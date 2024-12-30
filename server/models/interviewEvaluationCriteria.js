// models/interviewEvaluationCriteria.js
module.exports = (sequelize, DataTypes) => {
    const InterviewEvaluationCriteria = sequelize.define('InterviewEvaluationCriteria', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      client_job_interview_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'ClientJobInterview',
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
      tableName: 'InterviewEvaluationCriteria',
      timestamps: true,
    });
  
    InterviewEvaluationCriteria.associate = (models) => {
      InterviewEvaluationCriteria.belongsTo(models.ClientJobInterview, {
        foreignKey: 'client_job_interview_id',
        as: 'clientjobinterview',
      });
      InterviewEvaluationCriteria.belongsTo(models.JobInterviewEvaluationCategory, {
        foreignKey: 'evaluation_category_id',
        as: 'evaluation_category',
      });
    };
  
    return InterviewEvaluationCriteria;
  };
  