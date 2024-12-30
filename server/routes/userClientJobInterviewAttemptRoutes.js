const express = require('express');
const router = express.Router();
const userClientJobInterviewAttemptController = require('../controllers/userClientJobInterviewAttemptController');

router.post('/interview-attempt', userClientJobInterviewAttemptController.createInterviewAttempt);
router.put('/interview-attempt/:id', userClientJobInterviewAttemptController.updateInterviewAttempt);
router.get('/interview-attempt/:id', userClientJobInterviewAttemptController.getInterviewAttemptById);
router.get('/client-job-interview/attempt/', userClientJobInterviewAttemptController.getInterviewAttemptByClientJobInterviewId);
router.delete('/client-job-interview/attempt/', userClientJobInterviewAttemptController.deleteInterviewAttemptByClientJobInterviewId);
// New route for updating tab switch count
router.put('/interview-attempt/:id/tab-switch-count', userClientJobInterviewAttemptController.updateTabSwitchCount);

module.exports = router;

