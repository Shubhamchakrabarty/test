const express = require('express');
const router = express.Router();
const { uploadTextAnswer } = require('../controllers/textUploadController');

// Define the route for uploading text answers
router.post('/upload-text-answer', uploadTextAnswer);

module.exports = router;