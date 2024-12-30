// models/notificationTemplate.js
module.exports = (sequelize, DataTypes) => {
    const NotificationTemplate = sequelize.define('NotificationTemplate', {
        emailTemplate: {
            type: DataTypes.TEXT, // Store the HTML structure of the email
            allowNull: false,
        },
        notification_channel: {
            type: DataTypes.ENUM('Email', 'SMS', 'Whatsapp'), // Enum to specify the notification channel
            allowNull: false,
        },
        notification_use_case_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'NotificationUseCases', // Foreign key to NotificationUseCases table
                key: 'id',
            },
            allowNull: false,
        },
    });

    NotificationTemplate.associate = (models) => {
        // Define associations here if necessary
        NotificationTemplate.belongsTo(models.NotificationUseCase, {
            foreignKey: 'notification_use_case_id',
            as: 'notificationUseCase',
        });
    };

    return NotificationTemplate;
};
