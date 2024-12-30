const express = require('express');
const router = express.Router();
const scoreProfileController = require('../controllers/scoreProfileController');
const scoreInterviewController = require('../controllers/scoreInterviewController');


//New routes

//Score an interview attempt
router.post('/score-interview/:userClientJobInterviewAttemptId', scoreInterviewController.scoreInterview);
//Get scores for user for given job- latest attempt
router.get('/:userId/:clientJobId', scoreInterviewController.getJobInterviewScoresForUser);
//Get historical scores for given job for given user
router.get('/historical-scores/:userId/:clientJobId', scoreInterviewController.getAllJobInterviewScoresForUser);
//Get scores for all candidates for a given job
router.get('/client-jobs/:clientJobId/candidate-scores', scoreInterviewController.getAllCandidateScoresForJob);
// To GET the presigned URL for a file_url 
router.post('/get-presigned-url', scoreInterviewController.getPresignedUrl);

// Endpoint to trigger profile scoring
router.post('/score-profile', scoreProfileController.scoreProfile);
router.get('/latest/:userId', scoreProfileController.getLatestScore);
router.post('/score-interview', scoreProfileController.scoreInterview);

router.get('/latest-interview/:userId', scoreProfileController.getLatestInterviewScore);
module.exports = router;