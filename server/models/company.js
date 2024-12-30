// models/company.js
module.exports = (sequelize, DataTypes) => {
    const Company = sequelize.define('Company', {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });
    Company.associate = (models) => {
      Company.hasMany(models.Internship, {
        foreignKey: 'company_id',
      });
      Company.hasMany(models.Job, {
        foreignKey: 'company_id',
      });
    };

    return Company;
  };