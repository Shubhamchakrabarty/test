const express = require('express');
const router = express.Router();
const extracurricularsController = require('../controllers/extracurricularsController');

router.get('/categories', extracurricularsController.getExtracurricularCategories);
router.get('/activities', extracurricularsController.getExtracurricularsByCategory);
router.post('/addUserExtracurriculars', extracurricularsController.addUserExtracurriculars);

module.exports = router;