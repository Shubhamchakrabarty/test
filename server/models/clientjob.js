// models/clientjob.js
module.exports = (sequelize, DataTypes) => {
    const ClientJob = sequelize.define('ClientJob', {
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
        onDelete: 'CASCADE',
      },
      job_title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      job_description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM,
        values: ['Open', 'Closed', 'Archived'],
        defaultValue: 'Open',
        allowNull: false,
      },
      job_link: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    }, {
      tableName: 'ClientJobs',
      timestamps: true,
    });
  
    ClientJob.associate = (models) => {
      ClientJob.belongsTo(models.ClientUser, {
        foreignKey: 'client_user_id',
        as: 'client_user',
      });
      ClientJob.hasMany(models.ClientJobInterview, {
        foreignKey: 'job_id',
        as: 'job_interviews',
      });
      ClientJob.hasMany(models.CvUploadUserJob, { 
        foreignKey: 'job_id', 
        as: 'cv_uploads' 
      });
    };
  
    return ClientJob;
  };
  