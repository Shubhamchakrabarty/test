// models/extracurricular.js
module.exports = (sequelize, DataTypes) => {
    const Extracurricular = sequelize.define('Extracurricular', {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      category_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'ExtracurricularCategories',
          key: 'id',
        },
        allowNull: false,
      },
    });
    return Extracurricular;
  };