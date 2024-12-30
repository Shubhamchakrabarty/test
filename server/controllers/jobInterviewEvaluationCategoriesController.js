// controllers/jobInterviewEvaluationCategoriesController.js
const { JobInterviewEvaluationCategory } = require('../models');

// Create a new category
exports.createCategory = async (req, res) => {
  try {
    const { name, evaluation_level, description } = req.body;
    const category = await JobInterviewEvaluationCategory.create({ name, evaluation_level, description });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create category' });
  }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await JobInterviewEvaluationCategory.findAll();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve categories' });
  }
};

// Get a specific category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await JobInterviewEvaluationCategory.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve category' });
  }
};

// Update a category by ID
exports.updateCategory = async (req, res) => {
  try {
    const { name, evaluation_level, description } = req.body;
    const category = await JobInterviewEvaluationCategory.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    category.name = name;
    category.evaluation_level = evaluation_level;
    category.description = description;
    await category.save();
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update category' });
  }
};

// Delete a category by ID
exports.deleteCategory = async (req, res) => {
  try {
    const category = await JobInterviewEvaluationCategory.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    await category.destroy();
    res.status(204).json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete category' });
  }
};
