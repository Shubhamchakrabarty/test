// models/clientJobNotification.js
module.exports = (sequelize, DataTypes) => {
    const ClientJobNotification = sequelize.define('ClientJobNotification', {
        clientJobNotificationId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        clientJobId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'ClientJobs',
                key: 'id',
            },
            allowNull: false,
            onDelete: 'CASCADE',
        },
        notificationId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'NotificationTemplates',
                key: 'id',
            },
            allowNull: false,
            onDelete: 'CASCADE',
        },
    });

    ClientJobNotification.associate = (models) => {
        // Define associations here if necessary
        ClientJobNotification.belongsTo(models.ClientJob, {
            foreignKey: 'clientJobId',
            as: 'clientJob',
        });
        ClientJobNotification.belongsTo(models.NotificationTemplate, {
            foreignKey: 'notificationId',
            as: 'notificationTemplate',
        });
    };

    return ClientJobNotification;
};
