const express = require('express');
const {
  singleFileUpload,
  initiateUpload,
  getPresignedUrl,
  completeUpload,
  saveFileDetails,
  getAllVideoUploads,
  getVideoUploadById,
  getVideoUploadByAttemptId
} = require('../controllers/videoUploadController');

const router = express.Router();
// Route for single file upload
router.post('/single', singleFileUpload);
router.post('/details', saveFileDetails); // Save file details

// Routes
router.post('/initiate', initiateUpload);
router.post('/presigned-url', getPresignedUrl);
router.post('/complete', completeUpload);

// Route to fetch all video uploads
router.get('/', getAllVideoUploads);

// Route to fetch a video upload by ID
router.get('/:id', getVideoUploadById);
// Route to fetch video uploads by userClientJobInterviewAttemptId
router.get('/attempt/:attemptId', getVideoUploadByAttemptId);

module.exports = router;
