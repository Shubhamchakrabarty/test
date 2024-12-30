// server/routes/languages.js
const express = require('express');
const router = express.Router();
const { getLanguages, addUserLanguages, updateLanguageProficiency } = require('../controllers/languagesController');

router.get('/', getLanguages);
router.post('/add', addUserLanguages);
router.patch('/updateProficiency', updateLanguageProficiency);

module.exports = router;