// routes/referencesRoutes.js
const express = require('express');
const router = express.Router();
const referencesController = require('../controllers/referencesController');
const upload = require('../config/upload');

// Route to add a reference with file upload
router.post('/add', upload.single('file'), referencesController.addReference);


module.exports = router;