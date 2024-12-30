// models/videoUpload.js
module.exports = (sequelize, DataTypes) => {
    const VideoUpload = sequelize.define('VideoUpload', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
        allowNull: false,
        onDelete: 'CASCADE', // Ensure that video uploads are deleted if the user is deleted
      },
      user_client_job_interview_attempt_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'UserClientJobInterviewAttempts',  // Ensure this is the correct table name
          key: 'id',
        },
        allowNull: false,
        onDelete: 'CASCADE',
      },
      file_url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      file_size: {
        type: DataTypes.BIGINT, // Storing file size in bytes, so BIGINT is suitable
        allowNull: false,
      },
      compression_status: {
        type: DataTypes.ENUM('Uncompressed', 'Compressed', 'Failed'),
        allowNull: false,
        defaultValue: 'Uncompressed',
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    }, {
      tableName: 'VideoUploads',
      timestamps: true,
      underscored: true,
    });
  
    VideoUpload.associate = (models) => {
      VideoUpload.belongsTo(models.Users, {
        foreignKey: 'user_id',
        as: 'user',
      });
      VideoUpload.belongsTo(models.UserClientJobInterviewAttempt, {
        foreignKey: 'user_client_job_interview_attempt_id',
        as: 'attempt'
      });
    };
  
    return VideoUpload;
  };
  