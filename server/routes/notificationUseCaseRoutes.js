const express = require('express');
const router = express.Router();
const notificationUseCaseController = require('../controllers/notificationUseCaseController');

// Route to create a new notification use case
router.post('/create', notificationUseCaseController.createNotificationUseCase);

// Route to get all notification use cases
router.get('/', notificationUseCaseController.getAllNotificationUseCases);

module.exports = router;
