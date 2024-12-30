const express = require('express');
const router = express.Router();
const audioUploadController = require('../controllers/audioUploadController');
const uploadAudio = require('../config/uploadAudio');

router.post('/upload-audio', uploadAudio.single('audio'), audioUploadController.uploadAudioFile);

module.exports = router;