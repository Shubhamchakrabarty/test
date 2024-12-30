const express = require('express');
const router = express.Router();
const notificationTemplateController = require('../controllers/notificationTemplateController.js');

// Create a new Notification Template
router.post('/notification-templates', notificationTemplateController.createNotificationTemplate);

// Get all Notification Templates
router.get('/notification-templates', notificationTemplateController.getAllNotificationTemplates);

// Get a single Notification Template by ID
router.get('/notification-templates/:id', notificationTemplateController.getNotificationTemplateById);

// Update a Notification Template by ID
router.put('/notification-templates/:id', notificationTemplateController.updateNotificationTemplate);

// Delete a Notification Template by ID
router.delete('/notification-templates/:id', notificationTemplateController.deleteNotificationTemplate);

module.exports = router;
