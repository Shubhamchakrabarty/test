// models/internship.js
module.exports = (sequelize, DataTypes) => {
    const Internship = sequelize.define('Internship', {
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

    Internship.associate = (models) => {
      Internship.belongsTo(models.Users, {
        foreignKey: 'user_id',
      });
      Internship.belongsTo(models.InternshipDesignation, {
        foreignKey: 'designation_id',
      });
      Internship.belongsTo(models.Company, {
        foreignKey: 'company_id',
      });
    };
  
    return Internship;
  };