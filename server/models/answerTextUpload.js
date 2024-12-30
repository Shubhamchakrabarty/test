module.exports = (sequelize, DataTypes) => {
    const AnswerTextUpload = sequelize.define('AnswerTextUpload', {
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
      answer_text: {
        type: DataTypes.TEXT,
        allowNull: false, // Store the candidate’s typed response
        validate: {
            notNull: { msg: 'Answer cannot be null' },  // Ensure no `null` values
          },
        defaultValue: '',  // Default to an empty string
      },
      time_taken_to_answer: {
        type: DataTypes.FLOAT,
        allowNull: false, // Capture the time taken for WPM calculation
      },
    }, {
      tableName: 'AnswerTextUploads',
      timestamps: true,  // Automatically manages createdAt and updatedAt fields
    });
  
    AnswerTextUpload.associate = (models) => {
      AnswerTextUpload.belongsTo(models.Users, { foreignKey: 'user_id', as: 'user' });
      AnswerTextUpload.belongsTo(models.InterviewQuestion, { foreignKey: 'interview_question_id', as: 'interview_question' });
    };
  
    return AnswerTextUpload;
  };
  