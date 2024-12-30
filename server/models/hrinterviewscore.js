module.exports = (sequelize, DataTypes) => {
    const HrInterviewScore = sequelize.define('HrInterviewScore', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      responseId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'HrInterviewResponses',
          key: 'id',
        },
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
        allowNull: false,
      },
      interviewName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      functionalSkills: {
        type: DataTypes.JSONB,
        allowNull: true, // Allow nullable
      },
      communication: {
        type: DataTypes.JSONB,
        allowNull: true, // Allow nullable
      },
      personalityTraits: {
        type: DataTypes.JSONB,
        allowNull: true, // Allow nullable
      },
      logicalReasoning: {
        type: DataTypes.JSONB,
        allowNull: true, // Allow nullable
      },
      functionalSkillsScore: {
        type: DataTypes.FLOAT,
        allowNull: true, // Allow nullable
        defaultValue: 0.0,
      },
      communicationScore: {
        type: DataTypes.FLOAT,
        allowNull: true, // Allow nullable
        defaultValue: 0.0,
      },
      logicalReasoningScore: {
        type: DataTypes.FLOAT,
        allowNull: true, // Allow nullable
        defaultValue: 0.0,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
    }, {
      tableName: 'HrInterviewScores',
      timestamps: true,
    });
  
    HrInterviewScore.associate = (models) => {
      HrInterviewScore.belongsTo(models.HrInterviewResponse, {
        foreignKey: 'responseId',
      });
      HrInterviewScore.belongsTo(models.Users, {
        foreignKey: 'userId',
      });
    };
  
    return HrInterviewScore;
  };