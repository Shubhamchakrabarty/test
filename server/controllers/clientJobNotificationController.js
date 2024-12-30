const { ClientJobNotification, ClientJob, NotificationTemplate } = require('../models');

// Create a new ClientJobNotification
const createClientJobNotification = async (req, res) => {
    try {
        const { clientJobId, notificationId } = req.body;

        // Validate required fields
        if (!clientJobId || !notificationId) {
            return res.status(400).json({ message: 'clientJobId and notificationId are required.' });
        }

        // Create new ClientJobNotification
        const newNotification = await ClientJobNotification.create({
            clientJobId,
            notificationId,
        });

        res.status(201).json({ message: 'ClientJobNotification created successfully.', data: newNotification });
    } catch (error) {
        console.error('Error creating ClientJobNotification:', error);
        res.status(500).json({ message: 'Error creating ClientJobNotification.' });
    }
};

// Get all ClientJobNotifications
const getAllClientJobNotifications = async (req, res) => {
    try {
        const notifications = await ClientJobNotification.findAll({
            include: [
                { model: ClientJob, as: 'clientJob' },
                { model: NotificationTemplate, as: 'notificationTemplate' }
            ],
        });

        res.status(200).json({ data: notifications });
    } catch (error) {
        console.error('Error fetching ClientJobNotifications:', error);
        res.status(500).json({ message: 'Error fetching ClientJobNotifications.' });
    }
};

// Get a specific ClientJobNotification by ID
const getClientJobNotificationById = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await ClientJobNotification.findByPk(id, {
            include: [
                { model: ClientJob, as: 'clientJob' },
                { model: NotificationTemplate, as: 'notificationTemplate' }
            ],
        });

        if (!notification) {
            return res.status(404).json({ message: 'ClientJobNotification not found.' });
        }

        res.status(200).json({ data: notification });
    } catch (error) {
        console.error('Error fetching ClientJobNotification:', error);
        res.status(500).json({ message: 'Error fetching ClientJobNotification.' });
    }
};

// Update a ClientJobNotification
const updateClientJobNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const { clientJobId, notificationId } = req.body;

        // Validate required fields
        if (!clientJobId || !notificationId) {
            return res.status(400).json({ message: 'clientJobId and notificationId are required.' });
        }

        const notification = await ClientJobNotification.findByPk(id);

        if (!notification) {
            return res.status(404).json({ message: 'ClientJobNotification not found.' });
        }

        // Update the notification
        await notification.update({
            clientJobId,
            notificationId,
        });

        res.status(200).json({ message: 'ClientJobNotification updated successfully.', data: notification });
    } catch (error) {
        console.error('Error updating ClientJobNotification:', error);
        res.status(500).json({ message: 'Error updating ClientJobNotification.' });
    }
};

// Delete a ClientJobNotification
const deleteClientJobNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await ClientJobNotification.findByPk(id);

        if (!notification) {
            return res.status(404).json({ message: 'ClientJobNotification not found.' });
        }

        // Delete the notification
        await notification.destroy();

        res.status(200).json({ message: 'ClientJobNotification deleted successfully.' });
    } catch (error) {
        console.error('Error deleting ClientJobNotification:', error);
        res.status(500).json({ message: 'Error deleting ClientJobNotification.' });
    }
};

module.exports = {
    createClientJobNotification,
    getAllClientJobNotifications,
    getClientJobNotificationById,
    updateClientJobNotification,
    deleteClientJobNotification,
};
