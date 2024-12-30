// models/extracurricularcategory.js
module.exports = (sequelize, DataTypes) => {
    const ExtracurricularCategory = sequelize.define('ExtracurricularCategory', {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });
    return ExtracurricularCategory;
  };