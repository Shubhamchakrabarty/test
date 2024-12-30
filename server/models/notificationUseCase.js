module.exports = (sequelize, DataTypes) => {
    const NotificationUseCase = sequelize.define('NotificationUseCase', {
        use_case: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });

    return NotificationUseCase;
};