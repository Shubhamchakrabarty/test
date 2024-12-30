// models/jobInterviewEvaluationCategory.js
module.exports = (sequelize, DataTypes) => {
    const JobInterviewEvaluationCategory = sequelize.define('JobInterviewEvaluationCategory', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      evaluation_level: {
        type: DataTypes.ENUM('question', 'interview', 'job'),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    }, {
      tableName: 'JobInterviewEvaluationCategories',
      timestamps: true,
    });
  
    JobInterviewEvaluationCategory.associate = (models) => {
      JobInterviewEvaluationCategory.hasMany(models.ReferenceAnswer, {
        foreignKey: 'evaluation_category_id',
        as: 'reference_answers',
        onDelete: 'CASCADE',
      });
    };
  
    return JobInterviewEvaluationCategory;
  };
  