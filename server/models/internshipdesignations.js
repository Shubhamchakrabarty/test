module.exports = (sequelize, DataTypes) => {
    const InternshipDesignation = sequelize.define('InternshipDesignation', {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });

    InternshipDesignation.associate = (models) => {
      InternshipDesignation.hasMany(models.Internship, {
        foreignKey: 'designation_id',
      });
    };
  
    return InternshipDesignation;
  };