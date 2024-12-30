module.exports = (sequelize, DataTypes) => {
    const InterviewInstructions = sequelize.define('InterviewInstructions', {
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
      },
      pre_interview_instructions: {
        type: DataTypes.TEXT,
        allowNull: true,  // Optional
      },
      welcome_message: {
        type: DataTypes.TEXT,
        allowNull: true,  // Optional
      },
      welcome_video_url: {
        type: DataTypes.STRING,
        allowNull: true,  // Optional
      },
      context_video_url: {
        type: DataTypes.STRING,
        allowNull: true,  // Optional
      },
      context_video_text: {
        type: DataTypes.TEXT,
        allowNull: true,  // Optional - New field to capture text based on the context video
      },
      language: {
        type: DataTypes.ENUM('en-IN', 'hi'),  // ENUM for English and Hindi
        allowNull: false,
        defaultValue: 'en-IN',  // Default to English (Indian)
      },
      interview_response_type: {
        type: DataTypes.ENUM('audio', 'text', 'video'),
        allowNull: false,
        defaultValue: 'audio',  // Default to audio
      },
    }, {
      tableName: 'InterviewInstructions',
      timestamps: true,  // Automatically manage createdAt and updatedAt
    });
  
    InterviewInstructions.associate = (models) => {
      InterviewInstructions.belongsTo(models.Interview, {
        foreignKey: 'interview_id',
        as: 'interview',
      });
    };
  
    return InterviewInstructions;
  };
  