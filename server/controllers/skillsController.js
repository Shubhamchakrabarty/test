// controllers/skillsController.js
const { Skill, UserSkill } = require('../models');
const { Op } = require('sequelize');

// Fetch skills with lazy loading and search functionality
exports.getSkills = async (req, res) => {
  try {
    const { filter = '', skip = 0, take = 1000 } = req.query; // Load 10 items at a time
    const skills = await Skill.findAll({
      where: {
        name: {
          [Op.iLike]: `%${filter}%`
        }
      },
      offset: parseInt(skip),
      limit: parseInt(take)
    });
    res.json(skills);
  } catch (error) {
    console.error('Error fetching skills:', error);
    res.status(500).json({ message: 'Error fetching skills' });
  }
};

exports.addUserSkills = async (req, res) => {
    const { user_id, skills } = req.body;
    try {
      console.log('Received skills data:', skills);
      await UserSkill.bulkCreate(skills.map(skill => ({
        user_id,
        skill_id: skill.skill_id,
        skill_rating_user: skill.rating,
      })));
      res.json({ message: 'Skills added successfully' });
    } catch (error) {
      console.error('Error adding skills:', error);
      res.status(500).json({ message: 'Error adding skills' });
    }
  };

  exports.updateUserSkillRating = async (req, res) => {
    const { user_id, skill_id, skill_rating_pehchan } = req.body;
    try {
      const userSkill = await UserSkill.findOne({
        where: {
          user_id,
          skill_id
        }
      });
      if (userSkill) {
        userSkill.skill_rating_pehchan = skill_rating_pehchan;
        await userSkill.save();
        res.json({ message: 'Skill rating updated successfully' });
      } else {
        res.status(404).json({ message: 'User skill not found' });
      }
    } catch (error) {
      console.error('Error updating skill rating:', error);
      res.status(500).json({ message: 'Error updating skill rating' });
    }
  };
