// models/clientJobScreeningRequirements.js
module.exports = (sequelize, DataTypes) => {
    const ClientJobScreeningRequirement = sequelize.define('ClientJobScreeningRequirement', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        job_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'ClientJobs',
                key: 'id',
            },
            allowNull: false,
            onDelete: 'CASCADE',
        },
        cvUploadRequired: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        cvScreeningInstructions: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    }, {
        tableName: 'clientJobScreeningRequirements',
        timestamps: true,
    });

    ClientJobScreeningRequirement.associate = (models) => {
        ClientJobScreeningRequirement.belongsTo(models.ClientJob, {
            foreignKey: 'job_id',
            as: 'client_job',
        });
    };

    return ClientJobScreeningRequirement;
};
