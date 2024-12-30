const express = require('express');
const router = express.Router();
const skillsController = require('../controllers/skillsController');

// Route to fetch skills
router.get('/skills', skillsController.getSkills);

// Route to add user skills
router.post('/addUserSkills', skillsController.addUserSkills);

router.patch('/updateUserSkillRating', skillsController.updateUserSkillRating);

module.exports = router;