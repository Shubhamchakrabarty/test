const express = require('express');
const router = express.Router();
const clientJobController = require('../controllers/clientJobController');

// POST route to create a new ClientJob
router.post('/client-jobs', clientJobController.createClientJob);

// GET route to fetch all ClientJobs
router.get('/client-jobs', clientJobController.getAllClientJobs);

// GET route to fetch a specific ClientJob by ID
router.get('/client-jobs/:id', clientJobController.getClientJobById);

// PUT route to update a specific ClientJob by ID
router.put('/client-jobs/:id', clientJobController.updateClientJob);

// DELETE route to delete a specific ClientJob by ID
router.delete('/client-jobs/:id', clientJobController.deleteClientJob);

// GET route to fetch all interviews for a specific job
router.get('/client-jobs/:job_id/interviews', clientJobController.getInterviewsForJob);

//route for fetching jobs linked to a client id:
router.get('/client-jobs/client/:clientId', clientJobController.getJobsByClientId);

// checks if the job URL is valid or not
router.get('/client-jobs/job/:jobURL', clientJobController.checkValidJobURL)

// PUT route to generate Job Link For Existing Job, in case the job link is broken or invalid
router.put('/client-jobs/updateJobLink/:job_id', clientJobController.generateJobLinkForExistingJob)

module.exports = router;
