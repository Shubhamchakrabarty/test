module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define('Users', {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    experienceLevel: {
      type: DataTypes.ENUM,
      values: ['Student', 'Graduate', 'Post Graduate', 'Intern', 'Entry Level Job', 'Senior Level Job'],
      allowNull: false,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    }
  });

  Users.associate = (models) => {
    Users.hasMany(models.Education, {
      foreignKey: 'user_id',
    });
    Users.hasMany(models.Internship, {
      foreignKey: 'user_id',
    });
    Users.hasMany(models.Job, {
      foreignKey: 'user_id',
    });
    Users.hasMany(models.UserProject, {
      foreignKey: 'user_id',
    });
  };

  return Users;
};