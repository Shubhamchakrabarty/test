const { NotificationUseCase } = require('../models'); // Replace with your actual model

// Controller to create a new notification use case
const createNotificationUseCase = async (req, res) => {
    try {
        const { use_case } = req.body;

        if (!use_case) {
            return res.status(400).json({ message: 'Use case is required' });
        }

        // Create the new notification use case in the database
        const newNotificationUseCase = await NotificationUseCase.create({
            use_case,
        });

        res.status(201).json({ message: 'Notification use case created successfully', newNotificationUseCase });
    } catch (error) {
        console.error('Error creating notification use case:', error);
        res.status(500).json({ message: 'Error creating notification use case' });
    }
};

// Controller to get all notification use cases
const getAllNotificationUseCases = async (req, res) => {
    try {
        const notificationUseCases = await NotificationUseCase.findAll();

        if (!notificationUseCases || notificationUseCases.length === 0) {
            return res.status(404).json({ message: 'No notification use cases found' });
        }

        res.status(200).json(notificationUseCases);
    } catch (error) {
        console.error('Error fetching notification use cases:', error);
        res.status(500).json({ message: 'Error fetching notification use cases' });
    }
};

module.exports = {
    createNotificationUseCase,
    getAllNotificationUseCases,
};
