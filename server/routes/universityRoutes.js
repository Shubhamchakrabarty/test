const express = require('express');
const router = express.Router();
const universityController = require('../controllers/universityController');

router.get('/universities', universityController.getUniversities);
router.get('/getUniversityNames', universityController.getUniversityNames);

module.exports = router;