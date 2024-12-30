// models/screenCaptureUpload.js
module.exports = (sequelize, DataTypes) => {
    const ScreenCaptureUpload = sequelize.define('ScreenCaptureUpload', {
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
        onDelete: 'CASCADE', // Ensure that screen capture uploads are deleted if the interview is deleted
      },
      user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
        allowNull: false,
        onDelete: 'CASCADE', // Ensure that screen capture uploads are deleted if the user is deleted
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
      tableName: 'ScreenCaptureUploads',
      timestamps: true,
      underscored: true,
    });
  
    ScreenCaptureUpload.associate = (models) => {
      ScreenCaptureUpload.belongsTo(models.Interview, {
        foreignKey: 'interview_id',
        as: 'interview',
      });
      ScreenCaptureUpload.belongsTo(models.Users, {
        foreignKey: 'user_id',
        as: 'user',
      });
    };
  
    return ScreenCaptureUpload;
  };
  