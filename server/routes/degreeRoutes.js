// routes/degreeRoutes.js
const express = require('express');
const router = express.Router();
const degreeController = require('../controllers/degreeController');

router.get('/degrees', degreeController.getDegrees);

module.exports = router;