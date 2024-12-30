const { CvUploadUserJob, Users, ClientJob } = require('../models');

// Controller to get CV details based on user_id and job_id
const getCvDetails = async (req, res) => {
    const { user_id, job_id } = req.params;

    try {
        const cvDetails = await CvUploadUserJob.findOne({
            where: {
                user_id,
                job_id,
            },
            include: [
                {
                    model: Users,
                    as: 'user',
                    attributes: ['id', 'firstName', 'lastName', 'email', 'phoneNumber'], // Add other relevant user attributes if needed
                },
                {
                    model: ClientJob,
                    as: 'job',
                    attributes: ['id', 'job_title', 'job_description'], // Add other relevant job attributes if needed
                },
            ],
        });

        if (!cvDetails) {
            return res.status(404).json({ message: 'CV details not found for the provided user and job IDs.' });
        }

        return res.status(200).json(cvDetails);
    } catch (error) {
        console.error('Error retrieving CV details:', error);
        return res.status(500).json({ message: 'An error occurred while retrieving CV details.' });
    }
};

module.exports = { getCvDetails };
