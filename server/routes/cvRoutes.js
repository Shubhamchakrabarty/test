// routes.js or your main app file
const express = require('express');
const router = express.Router();
const cvUploadController = require('../controllers/cvUploadController');
const uploadCv = require('../config/uploadCv');


// Upload CV file -> needs user id, job id and socket id
router.post('/upload-cv', uploadCv.single('cv'), cvUploadController.uploadCvFile);

// Check if CV is uploaded for a particular user job based on user_id and job_id
router.get('/check-cv/:userId/:jobId', cvUploadController.checkCvUpload);

// Delete CV for a particular user job based on user_id and job_id
router.delete('/user-job-cv/:userId/:jobId', cvUploadController.deleteUserJobCV);

// Check if CV is uploaded for all jobs for a particular user job based on user_id
router.get('/check-cv/:userId', cvUploadController.checkCvUploadForAllJobs);
module.exports = router;


