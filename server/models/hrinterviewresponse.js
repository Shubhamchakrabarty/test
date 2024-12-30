module.exports = (sequelize, DataTypes) => {
  const HrInterviewResponse = sequelize.define('HrInterviewResponse', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    formTitle: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    formId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    response: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  }, {
    tableName: 'HrInterviewResponses',
    timestamps: true,
  });

  HrInterviewResponse.associate = (models) => {
    // Define associations here if needed
  };

  return HrInterviewResponse;
};