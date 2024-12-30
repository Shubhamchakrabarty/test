// models/clientjobinterview.js
module.exports = (sequelize, DataTypes) => {
    const ClientJobInterview = sequelize.define('ClientJobInterview', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      job_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'ClientJobs',
          key: 'id',
        },
        allowNull: false,
        onDelete: 'CASCADE',
      },
      interview_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Interviews',
          key: 'id',
        },
        allowNull: false,
        onDelete: 'CASCADE',
      },
      interview_order: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      question_set_selection_method: {
        type: DataTypes.ENUM,
        values: ['random', 'fixed'],
        defaultValue: 'fixed',
        allowNull: false,
      },
      question_set_fixed: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false,
      },
      number_of_question_sets: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false,
      }
    }, {
      tableName: 'ClientJobInterviews',
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ['job_id', 'interview_id']
        },
        {
          unique: true,
          fields: ['job_id', 'interview_order']
        }
      ]
    });
  
    ClientJobInterview.associate = (models) => {
      ClientJobInterview.belongsTo(models.ClientJob, {
        foreignKey: 'job_id',
        as: 'clientjob',
      });
      ClientJobInterview.belongsTo(models.Interview, {
        foreignKey: 'interview_id',
        as: 'interview',
      });
    };
  
    return ClientJobInterview;
  };
  