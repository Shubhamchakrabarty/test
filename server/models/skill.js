// models/skill.js
module.exports = (sequelize, DataTypes) => {
    const Skill = sequelize.define('Skill', {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });
    return Skill;
  };