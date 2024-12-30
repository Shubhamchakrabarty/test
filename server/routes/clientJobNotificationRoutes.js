const express = require('express');
const router = express.Router();
const clientJobNotificationController = require('../controllers/clientJobNotificationController');

// Create a new ClientJobNotification
router.post('/', clientJobNotificationController.createClientJobNotification);

// Get all ClientJobNotifications
router.get('/', clientJobNotificationController.getAllClientJobNotifications);

// Get a specific ClientJobNotification by ID
router.get('/:id', clientJobNotificationController.getClientJobNotificationById);

// Update a specific ClientJobNotification by ID
router.put('/:id', clientJobNotificationController.updateClientJobNotification);

// Delete a specific ClientJobNotification by ID
router.delete('/:id', clientJobNotificationController.deleteClientJobNotification);

module.exports = router;
