module.exports = (sequelize, DataTypes) => {
    const AudioUpload = sequelize.define('AudioUpload', {
      user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Users', // Assuming you have a Users model
          key: 'id',
        },
        allowNull: false,
      },
      file_url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      duration: {
        type: DataTypes.INTEGER,
        allowNull: true, // Optional field
      },
      question_id: {
        type: DataTypes.INTEGER,
        allowNull: true, // Optional field
      },
    });
  
    AudioUpload.associate = (models) => {
      AudioUpload.belongsTo(models.Users, { foreignKey: 'user_id', as: 'user' });
    };
  
    return AudioUpload;
  };
  