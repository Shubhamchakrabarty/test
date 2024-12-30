const express = require('express');
const router = express.Router();
const clientJobScreeningController = require('../controllers/clientJobScreeningController.js');

// POST route to create a new screening requirement
router.post('/client-job-screening-requirements', clientJobScreeningController.createScreeningRequirement);

// GET route to fetch all screening requirements
router.get('/client-job-screening-requirements', clientJobScreeningController.getAllScreeningRequirements);

// GET route to fetch a specific screening requirement by ID
router.get('/client-job-screening-requirements/:id', clientJobScreeningController.getScreeningRequirementById);

// PUT route to update a specific screening requirement by ID
router.put('/client-job-screening-requirements/:id', clientJobScreeningController.updateScreeningRequirement);

// DELETE route to delete a specific screening requirement by ID
router.delete('/client-job-screening-requirements/:id', clientJobScreeningController.deleteScreeningRequirement);

// GET route to fetch screening requirements for a specific job
router.get('/client-job-screening-requirements/job/:job_id', clientJobScreeningController.getScreeningRequirementsByJobId);

module.exports = router;
