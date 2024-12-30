module.exports = (sequelize, DataTypes) => {
    const CvUpload = sequelize.define('CvUpload', {
      user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
        allowNull: false,
      },
      file_url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });
  
    CvUpload.associate = (models) => {
      CvUpload.belongsTo(models.Users, { foreignKey: 'user_id', as: 'user' });
    };
  
    return CvUpload;
  };