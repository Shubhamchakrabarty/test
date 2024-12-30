// routes/educationRoutes.js
const express = require('express');
const router = express.Router();
const educationController = require('../controllers/educationController');

router.post('/addEducation', educationController.addEducation);
router.get('/education/:userId', educationController.getEducationData);
router.patch('/education/:id', educationController.updateEducation);
router.delete('/education/:id', educationController.deleteEducation);
router.get('/education/entry/:id', educationController.getEducationEntryById);
module.exports = router;