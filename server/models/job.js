// models/job.js
module.exports = (sequelize, DataTypes) => {
    const Job = sequelize.define('Job', {
      user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
        allowNull: false,
      },
      designation_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Designations',
          key: 'id',
        },
        allowNull: false,
      },
      company_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Companies',
          key: 'id',
        },
        allowNull: false,
      },
      is_current: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      start_date: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      end_date: {
        type: DataTypes.STRING,
        allowNull: true, // allow null if is_current is true
      },
      experience_summary: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    }, {
      indexes: [
        {
          unique: true,
          fields: ['user_id', 'designation_id', 'company_id']
        }
      ]
    });
    

    Job.associate = (models) => {
      Job.belongsTo(models.Company, {
        foreignKey: 'company_id',
      });
      Job.belongsTo(models.Designation, {
        foreignKey: 'designation_id',
      });
      Job.belongsTo(models.Users, {
        foreignKey: 'user_id',
      });
    };
  
    return Job;
  };