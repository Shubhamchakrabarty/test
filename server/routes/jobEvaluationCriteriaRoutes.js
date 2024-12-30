// routes/jobEvaluationCriteriaRoutes.js
const express = require('express');
const router = express.Router();
const jobEvaluationCriteriaController = require('../controllers/jobEvaluationCriteriaController');

// Create a new Job Evaluation Criteria
router.post('/', jobEvaluationCriteriaController.createJobEvaluationCriteria);

// Get all Job Evaluation Criteria for a specific job
router.get('/:job_id', jobEvaluationCriteriaController.getJobEvaluationCriteria);

// Update a Job Evaluation Criteria by ID
router.put('/:id', jobEvaluationCriteriaController.updateJobEvaluationCriteria);

// Delete a Job Evaluation Criteria by ID
router.delete('/:id', jobEvaluationCriteriaController.deleteJobEvaluationCriteria);

module.exports = router;
