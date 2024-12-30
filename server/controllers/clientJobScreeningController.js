const { ClientJobScreeningRequirement, ClientJob } = require('../models');

// Create a new screening requirement
const createScreeningRequirement = async (req, res) => {
    try {
        const { job_id, cvUploadRequired, cvScreeningInstructions } = req.body;

        // Check if the job_id exists in the ClientJob table
        const clientJob = await ClientJob.findOne({ where: { id: job_id } });

        if (!clientJob) {
            return res.status(404).json({ message: 'Client job not found' });
        }

        // Check if a screening requirement already exists for the given job_id
        const existingRequirement = await ClientJobScreeningRequirement.findOne({ where: { job_id } });

        if (existingRequirement) {
            return res.status(400).json({ message: 'A screening requirement already exists for this job' });
        }

        // Ensure cvUploadRequired defaults to false if not provided
        const newRequirement = await ClientJobScreeningRequirement.create({
            job_id,
            cvUploadRequired: cvUploadRequired !== undefined ? cvUploadRequired : false,
            cvScreeningInstructions,
        });

        res.status(201).json(newRequirement);
    } catch (error) {
        console.error('Error creating screening requirement:', error.message || error);
        res.status(500).json({ message: 'Error creating screening requirement' });
    }
};


// Get all screening requirements
const getAllScreeningRequirements = async (req, res) => {
    try {
        const requirements = await ClientJobScreeningRequirement.findAll();
        res.status(200).json(requirements);
    } catch (error) {
        console.error('Error fetching screening requirements:', error.message || error);
        res.status(500).json({ message: 'Error fetching screening requirements' });
    }
};

// Get a specific screening requirement by ID
const getScreeningRequirementById = async (req, res) => {
    const { id } = req.params;
    try {
        const requirement = await ClientJobScreeningRequirement.findByPk(id);
        if (!requirement) {
            return res.status(404).json({ message: 'Screening requirement not found' });
        }
        res.status(200).json(requirement);
    } catch (error) {
        console.error('Error fetching screening requirement:', error.message || error);
        res.status(500).json({ message: 'Error fetching screening requirement' });
    }
};

// Update a specific screening requirement by ID
const updateScreeningRequirement = async (req, res) => {
    const { id } = req.params;
    const { cvUploadRequired, cvScreeningInstructions } = req.body;
    try {
        const requirement = await ClientJobScreeningRequirement.findByPk(id);
        if (!requirement) {
            return res.status(404).json({ message: 'Screening requirement not found' });
        }

        // Ensure cvUploadRequired defaults to false if not provided
        await requirement.update({
            cvUploadRequired: cvUploadRequired !== undefined ? cvUploadRequired : false,
            cvScreeningInstructions,
        });

        res.status(200).json(requirement);
    } catch (error) {
        console.error('Error updating screening requirement:', error.message || error);
        res.status(500).json({ message: 'Error updating screening requirement' });
    }
};


// Delete a specific screening requirement by ID
const deleteScreeningRequirement = async (req, res) => {
    const { id } = req.params;
    try {
        const requirement = await ClientJobScreeningRequirement.findByPk(id);
        if (!requirement) {
            return res.status(404).json({ message: 'Screening requirement not found' });
        }
        await requirement.destroy();
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting screening requirement:', error.message || error);
        res.status(500).json({ message: 'Error deleting screening requirement' });
    }
};

const getScreeningRequirementsByJobId = async (req, res) => {
    const { job_id } = req.params; // Extract job_id from request params
    try {
        const requirement = await ClientJobScreeningRequirement.findOne({
            where: { job_id },
            include: {
                model: ClientJob,
                as: 'client_job', // This is the alias defined in the association
            },
        });

        if (!requirement) {
            return res.status(404).json({ message: 'No screening requirements found for the given job' });
        }

        res.status(200).json(requirement);
    } catch (error) {
        console.error('Error fetching screening requirements:', error.message || error);
        res.status(500).json({ message: 'Error fetching screening requirements' });
    }
};

module.exports = {
    createScreeningRequirement,
    getAllScreeningRequirements,
    getScreeningRequirementById,
    updateScreeningRequirement,
    deleteScreeningRequirement,
    getScreeningRequirementsByJobId
};
