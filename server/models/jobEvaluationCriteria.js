// models/jobEvaluationCriteria.js
module.exports = (sequelize, DataTypes) => {
    const JobEvaluationCriteria = sequelize.define('JobEvaluationCriteria', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      job_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'ClientJob',
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
      tableName: 'JobEvaluationCriteria',
      timestamps: true,
    });
  
    JobEvaluationCriteria.associate = (models) => {
      JobEvaluationCriteria.belongsTo(models.ClientJob, {
        foreignKey: 'job_id',
        as: 'clientjob',
      });
      JobEvaluationCriteria.belongsTo(models.JobInterviewEvaluationCategory, {
        foreignKey: 'evaluation_category_id',
        as: 'evaluation_category',
      });
    };
  
    return JobEvaluationCriteria;
  };
  