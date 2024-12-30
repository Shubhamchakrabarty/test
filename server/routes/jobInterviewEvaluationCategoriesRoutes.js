// routes/jobInterviewEvaluationCategories.js
const express = require('express');
const router = express.Router();
const jobInterviewEvaluationCategoriesController = require('../controllers/jobInterviewEvaluationCategoriesController');

// Create a new category
router.post('/', jobInterviewEvaluationCategoriesController.createCategory);

// Get all categories
router.get('/', jobInterviewEvaluationCategoriesController.getAllCategories);

// Get a specific category by ID
router.get('/:id', jobInterviewEvaluationCategoriesController.getCategoryById);

// Update a category by ID
router.put('/:id', jobInterviewEvaluationCategoriesController.updateCategory);

// Delete a category by ID
router.delete('/:id', jobInterviewEvaluationCategoriesController.deleteCategory);

module.exports = router;
