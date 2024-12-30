// routes/clientJobInterviewRoutes.js

const express = require('express');
const router = express.Router();
const clientJobInterviewController = require('../controllers/clientJobInterviewController');

router.get('/:client_job_interview_id', clientJobInterviewController.getClientJobInterview);
router.post('/link', clientJobInterviewController.linkInterviewToJob);
router.put('/:client_job_interview_id', clientJobInterviewController.updateClientJobInterview)

module.exports = router;
