module.exports = (sequelize, DataTypes) => {
    const Transcription = sequelize.define('Transcription', {
      audio_upload_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'AudioUpload',
          key: 'id',
        },
        allowNull: false,
      },
      transcript: {
        type: DataTypes.TEXT,
        allowNull: false,
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
    });
  
    Transcription.associate = (models) => {
      Transcription.belongsTo(models.AudioUpload, { foreignKey: 'audio_upload_id', as: 'audioUpload' });
    };
  
    return Transcription;
  };
  