// routes/interviewEvaluationCriteriaRoutes.js
const express = require('express');
const router = express.Router();
const interviewEvaluationCriteriaController = require('../controllers/interviewEvaluationCriteriaController');

// Create a new Interview Evaluation Criteria
router.post('/', interviewEvaluationCriteriaController.createInterviewEvaluationCriteria);

// Get all Interview Evaluation Criteria for a specific interview
router.get('/:client_job_interview_id', interviewEvaluationCriteriaController.getInterviewEvaluationCriteria);

// Update an Interview Evaluation Criteria by ID
router.put('/:id', interviewEvaluationCriteriaController.updateInterviewEvaluationCriteria);

// Delete an Interview Evaluation Criteria by ID
router.delete('/:id', interviewEvaluationCriteriaController.deleteInterviewEvaluationCriteria);

module.exports = router;
