// routes/questionEvaluationCriteriaRoutes.js
const express = require('express');
const router = express.Router();
const questionEvaluationCriteriaController = require('../controllers/questionEvaluationCriteriaController');

// Create a new Question Evaluation Criteria
router.post('/', questionEvaluationCriteriaController.createQuestionEvaluationCriteria);

// Get all Question Evaluation Criteria for a specific question
router.get('/', questionEvaluationCriteriaController.getQuestionEvaluationCriteria);

// Update a Question Evaluation Criteria by ID 
router.put('/', questionEvaluationCriteriaController.updateQuestionEvaluationCriteria);

// Delete a Question Evaluation Criteria by ID 
router.delete('/', questionEvaluationCriteriaController.deleteQuestionEvaluationCriteria);

module.exports = router;
