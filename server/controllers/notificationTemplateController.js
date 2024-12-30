const { NotificationTemplate, NotificationUseCase } = require('../models'); // Import models

// Create a new Notification Template
const createNotificationTemplate = async (req, res) => {
    try {
        const { emailTemplate, notification_channel, notification_use_case_id } = req.body;

        // Check if Notification Use Case exists
        const useCase = await NotificationUseCase.findByPk(notification_use_case_id);
        if (!useCase) {
            return res.status(404).json({ message: 'Notification Use Case not found' });
        }

        // Create Notification Template
        const notificationTemplate = await NotificationTemplate.create({
            emailTemplate,
            notification_channel,
            notification_use_case_id,
        });

        return res.status(201).json(notificationTemplate);
    } catch (error) {
        console.error('Error creating notification template:', error);
        return res.status(500).json({ message: 'Error creating notification template' });
    }
};

// Get all Notification Templates
const getAllNotificationTemplates = async (req, res) => {
    try {
        const notificationTemplates = await NotificationTemplate.findAll({
            include: {
                model: NotificationUseCase,
                as: 'notificationUseCase',
            },
        });

        return res.status(200).json(notificationTemplates);
    } catch (error) {
        console.error('Error fetching notification templates:', error);
        return res.status(500).json({ message: 'Error fetching notification templates' });
    }
};

// Get a single Notification Template by ID
const getNotificationTemplateById = async (req, res) => {
    try {
        const { id } = req.params;
        const notificationTemplate = await NotificationTemplate.findByPk(id, {
            include: {
                model: NotificationUseCase,
                as: 'notificationUseCase',
            },
        });

        if (!notificationTemplate) {
            return res.status(404).json({ message: 'Notification Template not found' });
        }

        return res.status(200).json(notificationTemplate);
    } catch (error) {
        console.error('Error fetching notification template:', error);
        return res.status(500).json({ message: 'Error fetching notification template' });
    }
};

// Update a Notification Template by ID
const updateNotificationTemplate = async (req, res) => {
    try {
        const { id } = req.params;
        const { emailTemplate, notification_channel, notification_use_case_id } = req.body;

        // Check if Notification Use Case exists
        const useCase = await NotificationUseCase.findByPk(notification_use_case_id);
        if (!useCase) {
            return res.status(404).json({ message: 'Notification Use Case not found' });
        }

        // Update Notification Template
        const [updated] = await NotificationTemplate.update(
            { emailTemplate, notification_channel, notification_use_case_id },
            { where: { id } }
        );

        if (updated) {
            const updatedNotificationTemplate = await NotificationTemplate.findByPk(id);
            return res.status(200).json(updatedNotificationTemplate);
        }

        return res.status(404).json({ message: 'Notification Template not found' });
    } catch (error) {
        console.error('Error updating notification template:', error);
        return res.status(500).json({ message: 'Error updating notification template' });
    }
};

// Delete a Notification Template by ID
const deleteNotificationTemplate = async (req, res) => {
    try {
        const { id } = req.params;

        // Delete Notification Template
        const deleted = await NotificationTemplate.destroy({ where: { id } });

        if (deleted) {
            return res.status(204).json();
        }

        return res.status(404).json({ message: 'Notification Template not found' });
    } catch (error) {
        console.error('Error deleting notification template:', error);
        return res.status(500).json({ message: 'Error deleting notification template' });
    }
};

module.exports = {
    createNotificationTemplate,
    getAllNotificationTemplates,
    getNotificationTemplateById,
    updateNotificationTemplate,
    deleteNotificationTemplate,
};
