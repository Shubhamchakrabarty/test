// models/designation.js
module.exports = (sequelize, DataTypes) => {
    const Designation = sequelize.define('Designation', {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });

    Designation.associate = (models) => {
      Designation.hasMany(models.Job, {
        foreignKey: 'designation_id',
      });
    };

    return Designation;
  };