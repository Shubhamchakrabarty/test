// server/routes/interviewRoutes.js
const express = require('express');
const { 
    checkInterviewCompletion, 
    getUniqueFormTitles, 
    createInterview, 
    getAllInterviews,
    getInterviewById,
    updateInterview,
    deleteInterview,
    getQuestionsForInterview,
    getQuestionsForClientJobInterview,
    getClientJobInterviewDetails,
    createInterviewInstructions,
    getInterviewInstructionsById,
    updateInterviewInstructions,
    deleteInterviewInstructions,
    getInterviewInstructionsByInterviewId
 } = require('../controllers/interviewController');
const router = express.Router();

router.get('/check-completion/:email', checkInterviewCompletion);
router.get('/unique-form-titles/:userId', getUniqueFormTitles);
router.post('/', createInterview);
router.get('/', getAllInterviews);
router.get('/:id', getInterviewById);
router.put('/:id', updateInterview);
router.delete('/:id', deleteInterview);

// GET route to fetch all questions for a specific interview
router.get('/:interview_id/questions', getQuestionsForInterview);

router.get('/client-job-interview/:client_job_interview_id/questions', getQuestionsForClientJobInterview);

router.get('/client-job-interview/:client_job_interview_id/details', getClientJobInterviewDetails);

// New CRUD routes for Interview Instructions
router.post('/:interview_id/instructions', createInterviewInstructions);
router.get('/:interview_id/instructions/:id', getInterviewInstructionsById);
router.put('/:interview_id/instructions/:id', updateInterviewInstructions);
router.delete('/:interview_id/instructions/:id', deleteInterviewInstructions);

router.get('/:interviewId/instructions', getInterviewInstructionsByInterviewId);




module.exports = router;