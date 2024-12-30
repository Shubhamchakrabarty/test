// models/question.js
module.exports = (sequelize, DataTypes) => {
    const Question = sequelize.define('Question', {
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
      question_text: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      question_type: {
        type: DataTypes.ENUM,
        values: ['Audio', 'Video', 'Text', 'Image'],
        allowNull: false,
      },
      media_url: {
        type: DataTypes.STRING,
        allowNull: true, // Optional field
      },
      text_instructions: {
        type: DataTypes.TEXT,
        allowNull: true, // Optional field
      },
    }, {
      tableName: 'Questions',
      timestamps: true, // Enable automatic timestamps for createdAt and updatedAt
    });
  
    Question.associate = (models) => {
      Question.belongsTo(models.ClientUser, {
        foreignKey: 'client_user_id',
        as: 'client_user',
      });
      Question.belongsToMany(models.Interview, {
        through: 'InterviewQuestions',
        foreignKey: 'question_id',
        as: 'interviews',
      });
      Question.hasMany(models.AudioUpload, {
        foreignKey: 'question_id',
        as: 'audio_uploads',
      });
    };
  
    return Question;
  };
  