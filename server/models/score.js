module.exports = (sequelize, DataTypes) => {
    const Score = sequelize.define('Score', {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      school_1_score: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
      school_2_score: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
      undergrad_university_score: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
      undergrad_cgpa_score: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
      postgrad_university_score: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
      postgrad_cgpa_score: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
      school_1_weight: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 1.0
      },
      school_2_weight: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 1.0
      },
      undergrad_university_weight: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 1.0
      },
      undergrad_cgpa_weight: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 1.0
      },
      postgrad_university_weight: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 1.0
      },
      postgrad_cgpa_weight: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 1.0
      },
      internships_score: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
      work_experience_score: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
      projects_score: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
      internships_weight: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 1.0
      },
      work_experience_weight: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 1.0
      },
      projects_weight: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 1.0
      },
      final_score: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
    }, {
      timestamps: false,
      tableName: 'Scores'
    });
  
    Score.associate = function(models) {
      Score.belongsTo(models.Users, { foreignKey: 'user_id' });
    };
  
    return Score;
  };