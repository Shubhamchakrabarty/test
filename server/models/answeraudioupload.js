// models/answerAudioUpload.js
module.exports = (sequelize, DataTypes) => {
    const AnswerAudioUpload = sequelize.define('AnswerAudioUpload', {
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
        onDelete: 'CASCADE',
      },
      interview_question_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'InterviewQuestions',
          key: 'id',
        },
        allowNull: false,
        onDelete: 'CASCADE',
      },
      file_url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      time_taken_to_answer: {
        type: DataTypes.INTEGER,
        allowNull: false, 
      },
    }, {
      tableName: 'AnswerAudioUploads',
      timestamps: true,
    });
  
    AnswerAudioUpload.associate = (models) => {
      AnswerAudioUpload.belongsTo(models.Users, {
        foreignKey: 'user_id',
        as: 'user',
      });
      AnswerAudioUpload.belongsTo(models.InterviewQuestion, {
        foreignKey: 'interview_question_id',
        as: 'interview_question',
      });
      AnswerAudioUpload.hasMany(models.AnswerTranscript, {
        foreignKey: 'answer_audio_upload_id',
        as: 'transcripts',
      });
    };
  
    return AnswerAudioUpload;
  };
  