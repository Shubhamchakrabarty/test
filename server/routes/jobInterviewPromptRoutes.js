const express = require('express');
const router = express.Router();
const jobInterviewPromptController = require('../controllers/jobInterviewPromptController');

// Create a new Job Interview Prompt
router.post('/', jobInterviewPromptController.createJobInterviewPrompt);

// Get all Job Interview Prompts for a specific interview
router.get('/:client_job_interview_id', jobInterviewPromptController.getJobInterviewPrompts);

// Update a Job Interview Prompt by ID
router.put('/:id', jobInterviewPromptController.updateJobInterviewPrompt);

// Delete a Job Interview Prompt by ID
router.delete('/:id', jobInterviewPromptController.deleteJobInterviewPrompt);


// Create a new Reference Answer
router.post('/reference-answers', jobInterviewPromptController.createReferenceAnswer);

// Get all Reference Answers for a specific interview question
router.get('/reference-answers/:interview_question_id', jobInterviewPromptController.getReferenceAnswers);

// Update a Reference Answer by ID
router.put('/reference-answers/:id', jobInterviewPromptController.updateReferenceAnswer);

// Delete a Reference Answer by ID
router.delete('/reference-answers/:id', jobInterviewPromptController.deleteReferenceAnswer);

module.exports = router;
