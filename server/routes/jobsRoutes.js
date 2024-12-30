// routes/jobsRoutes.js
const express = require('express');
const router = express.Router();
const jobsController = require('../controllers/jobsController');

router.get('/companies', jobsController.getCompanies);
router.get('/designations', jobsController.getDesignations);
router.post('/addJob', jobsController.addJob);
router.get('/internship-designations', jobsController.getInternshipDesignations);
router.post('/addInternship', jobsController.addInternship);
router.get('/internships/:userId', jobsController.getInternshipsByUserId);
router.get('/internship/:id', jobsController.getInternshipById);
router.patch('/internship/:id', jobsController.updateInternship);
router.delete('/internship/:id', jobsController.deleteInternship);
router.get('/job/:id', jobsController.getJobById); // Fetch a single job by ID
router.get('/jobs/:userId', jobsController.getJobsByUserId); // Fetch all jobs by user ID
router.patch('/job/:id', jobsController.updateJob); // Update a job by ID
router.delete('/job/:id', jobsController.deleteJob); // Delete a job by ID


module.exports = router;