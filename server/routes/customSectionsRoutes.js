// routes/customSectionsRoutes.js
const express = require('express');
const router = express.Router();
const customSectionsController = require('../controllers/customSectionsController');

// Route to add custom sections
router.post('/add', customSectionsController.addUserCustomSections);

module.exports = router;