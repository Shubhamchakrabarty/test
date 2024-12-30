// server/routes/hobbies.js
const express = require('express');
const router = express.Router();
const { getHobbyCategories, getHobbiesByCategory, addUserHobbies } = require('../controllers/hobbiesController');

router.get('/categories', getHobbyCategories);
router.get('/activities', getHobbiesByCategory);
router.post('/add', addUserHobbies);

module.exports = router;