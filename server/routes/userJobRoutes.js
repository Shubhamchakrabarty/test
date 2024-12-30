const express = require('express');
const router = express.Router();
const userJobController = require('../controllers/userJobController');

// POST route to create a new UserJob
router.post('/user-jobs', userJobController.createUserJob);

// GET route to fetch all UserJobs for a specific user
router.get('/user-jobs/:user_id', userJobController.getUserJobs);

// PUT route to update the status of a UserJob by ID
router.put('/user-jobs/:id', userJobController.updateUserJob);

// DELETE route to delete a UserJob by ID
router.delete('/user-jobs/:id', userJobController.deleteUserJob);

// GET route to fetch all user jobs for a specific job 
router.get('/user-jobs/job/:job_id', userJobController.getUserJobsByJobId);

// POST route to send shortlist mail 
router.post('/user-jobs/sendEmail/shortlist', userJobController.shortlistUsers);

// POST route to send reject mail
router.post('/user-jobs/sendEmail/reject', userJobController.rejectUsers);
module.exports = router;
