const { Extracurricular, ExtracurricularCategory, UserExtraCurricular } = require('../models');
const { Op } = require('sequelize');

// Fetch extracurricular categories
exports.getExtracurricularCategories = async (req, res) => {
  try {
    const categories = await ExtracurricularCategory.findAll();
    res.json(categories);
  } catch (error) {
    console.error('Error fetching extracurricular categories:', error);
    res.status(500).json({ message: 'Error fetching categories' });
  }
};

// Fetch extracurricular activities based on category
exports.getExtracurricularsByCategory = async (req, res) => {
  const { categoryId } = req.query;
  console.log('Category ID:', categoryId); // Debugging line
  if (!categoryId) {
    return res.status(400).json({ message: 'Category ID is required' });
  }
  
  try {
    const extracurriculars = await Extracurricular.findAll({
      where: { category_id: categoryId }
    });
    res.json(extracurriculars);
  } catch (error) {
    console.error('Error fetching extracurriculars:', error);
    res.status(500).json({ message: 'Error fetching extracurriculars' });
  }
};

// Add user extracurriculars
exports.addUserExtracurriculars = async (req, res) => {
  const { user_id, extracurriculars } = req.body;
  console.log('Received extracurriculars data:', extracurriculars); // Debugging line
  try {
    const results = await UserExtraCurricular.bulkCreate(extracurriculars.map(activity => ({
      user_id,
      extracurricular_id: activity.extracurricular_id,
      extracurricular_category_id: activity.category_id,
      achievement: activity.achievement,
    })));
    console.log('Insert result:', results); // Debugging line
    res.json({ message: 'Extracurricular activities added successfully' });
  } catch (error) {
    console.error('Error adding extracurricular activities:', error);
    res.status(500).json({ message: 'Error adding extracurricular activities' });
  }
};