// models/userClientJobInterviewAttempt.js
module.exports = (sequelize, DataTypes) => {
    const UserClientJobInterviewAttempt = sequelize.define('UserClientJobInterviewAttempt', {
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
      },
      client_job_interview_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'ClientJobInterviews',
          key: 'id',
        },
        allowNull: false,
        onDelete: 'CASCADE',
      },
      interview_started: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true, // Interview is started when this record is created
      },
      interview_completed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false, // Initially, the interview is not completed
      },
      question_set_attempted: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false,
      },
      tab_switch_count: { // New field
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0, // Default value is 0 since no tab switches occur initially
      },
    }, {
      tableName: 'UserClientJobInterviewAttempts',
      timestamps: true,
    });

    UserClientJobInterviewAttempt.associate = (models) => {
      UserClientJobInterviewAttempt.belongsTo(models.Users, {
        foreignKey: 'user_id',
        as: 'user',
      });
      UserClientJobInterviewAttempt.belongsTo(models.ClientJobInterview, {
        foreignKey: 'client_job_interview_id',
        as: 'client_job_interview',
      });
      UserClientJobInterviewAttempt.hasMany(models.InterviewResponse, {
        foreignKey: 'user_client_job_interview_attempt_id',
        as: 'interview_responses',
      });
      UserClientJobInterviewAttempt.hasOne(models.VideoUpload, { // Add this association
        foreignKey: 'user_client_job_interview_attempt_id',
        as: 'videoUpload',
      });
    };

    return UserClientJobInterviewAttempt;
};
