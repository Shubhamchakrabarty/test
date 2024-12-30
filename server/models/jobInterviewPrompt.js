// models/jobInterviewPrompt.js
module.exports = (sequelize, DataTypes) => {
    const JobInterviewPrompt = sequelize.define('JobInterviewPrompt', {
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
      prompt_text: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      scoring_criteria: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    }, {
      tableName: 'JobInterviewPrompts',
      timestamps: true,
    });
  
    JobInterviewPrompt.associate = (models) => {
      JobInterviewPrompt.belongsTo(models.ClientJobInterview, {
        foreignKey: 'client_job_interview_id',
        as: 'clientjobinterview',
      });
      JobInterviewPrompt.belongsTo(models.JobInterviewEvaluationCategory, {
        foreignKey: 'evaluation_category_id',
        as: 'evaluation_category',
      });
    };
  
    return JobInterviewPrompt;
  };
  