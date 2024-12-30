// server/controllers/hobbiesController.js
const { Hobby, HobbyCategory, UserHobby } = require('../models');

// Fetch hobby categories
exports.getHobbyCategories = async (req, res) => {
  try {
    const categories = await HobbyCategory.findAll();
    res.json(categories);
  } catch (error) {
    console.error('Error fetching hobby categories:', error);
    res.status(500).json({ message: 'Error fetching categories' });
  }
};

// Fetch hobbies based on category
exports.getHobbiesByCategory = async (req, res) => {
  const { categoryId } = req.query;
  try {
    const hobbies = await Hobby.findAll({
      where: { category_id: categoryId }
    });
    res.json(hobbies);
  } catch (error) {
    console.error('Error fetching hobbies:', error);
    res.status(500).json({ message: 'Error fetching hobbies' });
  }
};

// Add user hobbies
exports.addUserHobbies = async (req, res) => {
  const { user_id, hobbies } = req.body;
  console.log('Received hobbies data:', hobbies); // Debugging line
  try {
    const results = await UserHobby.bulkCreate(hobbies.map(activity => ({
      user_id,
      hobby_id: activity.hobby_id,
      hobby_category_id: activity.category_id,
      achievements: activity.achievements,
    })));
    console.log('Insert result:', results); // Debugging line
    res.json({ message: 'Hobbies added successfully' });
  } catch (error) {
    console.error('Error adding hobbies:', error);
    res.status(500).json({ message: 'Error adding hobbies' });
  }
};