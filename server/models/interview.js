// models/interview.js
module.exports = (sequelize, DataTypes) => {
    const Interview = sequelize.define('Interview', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      client_user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'ClientUsers',
          key: 'id',
        },
        allowNull: false,
      },
      interview_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      interview_time_limit: {
        type: DataTypes.INTEGER,
        allowNull: true, // Optional field
      },
      time_limit_per_answer: {
        type: DataTypes.INTEGER,
        allowNull: true, // Optional field
      },
      status: {
        type: DataTypes.ENUM,
        values: ['Draft', 'Published', 'Archived'],
        defaultValue: 'Draft',
        allowNull: false,
      },
    }, {
      tableName: 'Interviews',
      timestamps: true, // Enable automatic timestamps for createdAt and updatedAt
    });
  
    Interview.associate = (models) => {
      Interview.belongsTo(models.ClientUser, {
        foreignKey: 'client_user_id',
        as: 'client_user',
      });
      Interview.hasMany(models.InterviewQuestion, {
        foreignKey: 'interview_id',
        as: 'interview_questions',
      });
      Interview.hasMany(models.InterviewResponse, {
        foreignKey: 'interview_id',
        as: 'interview_responses',
      });
      Interview.hasMany(models.VideoUpload, {
        foreignKey: 'interview_id',
        as: 'video_uploads',
      });
      Interview.hasMany(models.ScreenCaptureUpload, {
        foreignKey: 'interview_id',
        as: 'screen_capture_uploads',
      });
      Interview.hasOne(models.InterviewInstructions, {
        foreignKey: 'interview_id',
        as: 'instructions',
      });
    };
  
    return Interview;
  };
  