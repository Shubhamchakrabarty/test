// models/answerTranscript.js
module.exports = (sequelize, DataTypes) => {
    const AnswerTranscript = sequelize.define('AnswerTranscript', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      answer_audio_upload_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'AnswerAudioUpload',
          key: 'id',
        },
        allowNull: true, // Nullable to support text responses
      },
      answer_text_upload_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'AnswerTextUpload',
          key: 'id',
        },
        allowNull: true,  // Nullable to support audio responses
      },
      transcript: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      time_taken_to_answer: {
        type: DataTypes.FLOAT,
        allowNull: true,  // Time taken for both audio and text responses
      },
      response_type: {
        type: DataTypes.ENUM('audio', 'text', 'video'),
        allowNull: false,  // Enum to clearly specify response type
        defaultValue: 'audio',
      },
      service_used: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Deepgram',
      },
      confidence_score: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      pronunciation_accuracy: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      fluency_wpm: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      fluency_pauses: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      fluency_long_pauses: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      clarity_score: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      
    }, {
      tableName: 'AnswerTranscripts',
      timestamps: true,
    });
  
    AnswerTranscript.associate = (models) => {
      AnswerTranscript.belongsTo(models.AnswerAudioUpload, {
        foreignKey: 'answer_audio_upload_id',
        as: 'answer_audio_upload',
      });
      AnswerTranscript.belongsTo(models.AnswerTextUpload, { 
        foreignKey: 'answer_text_upload_id', 
        as: 'answer_text_upload' 
      });
    };
  
    return AnswerTranscript;
  };
  