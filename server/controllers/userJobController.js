const { Client, ClientUser, UserJob, ClientJob, Users, UserClientJobInterviewAttempt, ClientJobNotification, NotificationTemplate } = require('../models');
const { sendJobApplicationEmail, sendInviteCandidateToJobEmail, sendJobDecisionEmail } = require('../jobs/emailSendJob');
// Controller to create a new UserJob
const createUserJob = async (req, res) => {
    const { user_id, job_id, invite } = req.body;
    console.log(`Received request to create UserJob: ${JSON.stringify(req.body)}`);

    // finding the Client User id from the Client Job table 
    const clientJob = await ClientJob.findByPk(job_id);
    const clientUserId = clientJob.client_user_id;
    // finding the client id for the client user from the clientUser table 
    const clientUser = await ClientUser.findByPk(clientUserId);
    const clientId = clientUser.client_id;
    // finding the client name from the client table
    const client = await Client.findByPk(clientId);
    const clientName = client.name;

    try {
        // Check if a UserJob with the same user_id and job_id already exists
        const existingUserJob = await UserJob.findOne({
            where: {
                user_id,
                job_id,
            }
        });
        if (existingUserJob) {
            console.log(`UserJob with user_id: ${user_id} and job_id: ${job_id} already exists.`);
            return res.status(409).json({ message: 'UserJob with this user_id and job_id already exists.', userJob: existingUserJob });
        }

        // If not found, create a new UserJob
        const newUserJob = await UserJob.create({
            user_id,
            job_id,
            status: 'Eligible', // Default status set to 'Eligible'
        });

        // Fetch user and job details for the email
        const user = await Users.findByPk(user_id);
        const job = await ClientJob.findByPk(job_id);

        // Send job application email
        if (!invite || invite == false) {
            const clientJobNotifications = await ClientJobNotification.findAll({
                where: {
                    clientJobId: job_id,
                },
                include: [
                    {
                        model: NotificationTemplate,
                        as: 'notificationTemplate',
                        required: true,
                    }
                ]
            });
            if (clientJobNotifications && clientJobNotifications.length > 0) {
                // Check if any notification template has notification_use_case_id of 5
                const useCase3Template = clientJobNotifications.find(
                    (notification) => notification.notificationTemplate.notification_use_case_id === 3
                );

                if (useCase3Template) {
                    // Logic when a template with use case 5 is found
                    console.log('Template with use case 3 exists.');
                    // Send email using the found template with use case 5
                    await sendJobApplicationEmail(
                        {
                            firstName: user.firstName,
                            lastName: user.lastName,
                            email: user.email
                        },
                        {
                            jobTitle: job.job_title,
                            jobId: job_id,
                            clientName: clientName
                        },
                        useCase3Template.notificationTemplate.id
                    );
                } else {
                    // Logic when no template with use case 5 is found
                    console.log('No template with use case 5 found. Sending default template.');
                    // Send email using the default template (id = 2)
                    await sendJobApplicationEmail(
                        {
                            firstName: user.firstName,
                            lastName: user.lastName,
                            email: user.email
                        },
                        {
                            jobTitle: job.job_title,
                            jobId: job_id,
                            clientName: clientName
                        },
                        2
                    );
                }
            } else {
                // Logic when no ClientJobNotification found for the given job_id
                console.log('No ClientJobNotification found for the given job_id.');
                // Send email using the default template (id = 2)
                await sendJobApplicationEmail(
                    {
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email
                    },
                    {
                        jobTitle: job.job_title,
                        jobId: job_id,
                        clientName: clientName
                    },
                    2
                );
            }
        }
        else {
            // Check if there is a ClientJobNotification for this job_id
            const clientJobNotifications = await ClientJobNotification.findAll({
                where: {
                    clientJobId: job_id,
                },
                include: [
                    {
                        model: NotificationTemplate,
                        as: 'notificationTemplate',
                        required: true,
                    }
                ]
            });

            if (clientJobNotifications && clientJobNotifications.length > 0) {
                // Check if any notification template has notification_use_case_id of 5
                const useCase5Template = clientJobNotifications.find(
                    (notification) => notification.notificationTemplate.notification_use_case_id === 5
                );

                if (useCase5Template) {
                    // Logic when a template with use case 5 is found
                    console.log('Template with use case 5 exists.');
                    // Send email using the found template with use case 5
                    await sendInviteCandidateToJobEmail(
                        {
                            firstName: user.firstName,
                            lastName: user.lastName,
                            email: user.email
                        },
                        {
                            jobTitle: job.job_title,
                            jobId: job_id,
                            clientName: clientName
                        },
                        useCase5Template.notificationTemplate.id
                    );
                } else {
                    // Logic when no template with use case 5 is found
                    console.log('No template with use case 5 found. Sending default template.');
                    // Send email using the default template (id = 3)
                    await sendInviteCandidateToJobEmail(
                        {
                            firstName: user.firstName,
                            lastName: user.lastName,
                            email: user.email
                        },
                        {
                            jobTitle: job.job_title,
                            jobId: job_id,
                            clientName: clientName
                        },
                        3
                    );
                }
            } else {
                // Logic when no ClientJobNotification found for the given job_id
                console.log('No ClientJobNotification found for the given job_id.');
                // Send email using the default template (id = 3)
                await sendInviteCandidateToJobEmail(
                    {
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email
                    },
                    {
                        jobTitle: job.job_title,
                        jobId: job_id,
                        clientName: clientName
                    },
                    3
                );
            }
        }

        console.log(`New UserJob created: ${JSON.stringify(newUserJob)}`);
        res.status(201).json(newUserJob);
    } catch (error) {
        console.error('Error creating UserJob:', error.message || error);
        res.status(500).json({ message: 'Error creating UserJob' });
    }
};


// Controller to fetch all jobs for a specific user
const getUserJobs = async (req, res) => {
    const { user_id } = req.params;
    console.log(`Fetching jobs for user ID: ${user_id}`);

    try {
        const userJobs = await UserJob.findAll({
            where: { user_id },
            include: [
                {
                    model: ClientJob,
                    as: 'job',
                    attributes: ['job_title', 'job_description', 'job_link'],
                },
            ],
        });

        if (!userJobs.length) {
            return res.status(404).json({ message: 'No jobs found for this user.' });
        }

        res.status(200).json(userJobs);
    } catch (error) {
        console.error('Error fetching jobs for user:', error.message || error);
        res.status(500).json({ message: 'Error fetching jobs for the user.' });
    }
};

// Controller to update the status of a UserJob by ID
const updateUserJob = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    console.log(`Updating UserJob ID: ${id} with status: ${status}`);

    try {
        const userJob = await UserJob.findByPk(id);

        if (!userJob) {
            return res.status(404).json({ message: 'UserJob not found.' });
        }

        userJob.status = status;
        await userJob.save();

        console.log(`UserJob updated: ${JSON.stringify(userJob)}`);
        res.status(200).json(userJob);
    } catch (error) {
        console.error('Error updating UserJob:', error.message || error);
        res.status(500).json({ message: 'Error updating UserJob' });
    }
};

// Controller to delete a UserJob by ID
const deleteUserJob = async (req, res) => {
    const { id } = req.params;
    console.log(`Deleting UserJob ID: ${id}`);

    try {
        const userJob = await UserJob.findByPk(id);

        if (!userJob) {
            return res.status(404).json({ message: 'UserJob not found.' });
        }

        await userJob.destroy();
        console.log(`UserJob deleted: ${JSON.stringify(userJob)}`);
        res.status(200).json({ message: 'UserJob deleted successfully.' });
    } catch (error) {
        console.error('Error deleting UserJob:', error.message || error);
        res.status(500).json({ message: 'Error deleting UserJob' });
    }
};

const getUserJobsByJobId = async (req, res) => {
    const { job_id } = req.params;

    try {
        // Fetch all UserJob records for the specified job_id
        const userJobs = await UserJob.findAll({
            where: { job_id },
            include: [
                {
                    model: Users,
                    as: 'user',
                    attributes: [
                        'id', 'firstName', 'lastName', 'email',
                        'phoneNumber', 'state', 'city', 'experienceLevel', 'isVerified'
                    ]
                }
            ],
            attributes: ['id', 'job_id', 'user_id', 'status', 'createdAt', 'updatedAt']
        });

        if (userJobs.length === 0) {
            return res.status(404).json({ message: 'No UserJobs found for the specified job_id' });
        }

        // Fetch UserClientJobInterviewAttempts for all users in userJobs
        const userIds = userJobs.map(userJob => userJob.user_id);
        const interviewAttempts = await UserClientJobInterviewAttempt.findAll({
            where: {
                user_id: userIds,
                client_job_interview_id: job_id
            },
            attributes: ['user_id', 'interview_started', 'interview_completed']
        });

        // Map interviewAttempts by user_id for easy lookup
        const interviewAttemptsMap = interviewAttempts.reduce((map, attempt) => {
            map[attempt.user_id] = attempt;
            return map;
        }, {});

        // Combine data from UserJob and UserClientJobInterviewAttempt
        const response = userJobs.map(userJob => {
            const attempt = interviewAttemptsMap[userJob.user_id] || {};
            return {
                user_job_id: userJob.id,
                job_id: userJob.job_id,
                user_id: userJob.user_id,
                firstName: userJob.user.firstName,
                lastName: userJob.user.lastName,
                status: userJob.status,
                email: userJob.user.email,
                phoneNumber: userJob.user.phoneNumber,
                state: userJob.user.state,
                city: userJob.user.city,
                experienceLevel: userJob.user.experienceLevel,
                isVerified: userJob.user.isVerified,
                interviewStarted: attempt.interview_started || false,
                interviewCompleted: attempt.interview_completed || false,
                createdAt: userJob.createdAt,
                updatedAt: userJob.updatedAt
            };
        });

        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching UserJobs:', error.message || error);
        res.status(500).json({ message: 'Error fetching UserJobs' });
    }
};

const shortlistUsers = async (req, res) => {
    const job_id = req.body.job_id;
    console.log('Shortlisting users for job:', job_id);

    const shortlists = req.body.shortlists;
    try {
        console.log('Shortlists', shortlists);
        // Fetching user details from the shortlist array 
        const userIds = shortlists.map(shortlist => shortlist.userId);
        // changing the userjob status to 'Accepted' for the shortlisted users
        await UserJob.update(
            { status: 'Accepted' },
            {
                where: {
                    user_id: userIds,
                    job_id
                }
            }
        );
        const detailedShortlistedUsers = await Users.findAll({
            where: {
                id: userIds
            },
            attributes: ['id', 'firstName', 'lastName', 'email']
        });
        const userDetails = detailedShortlistedUsers.map(user => ({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        }));
        console.log(userDetails);

        // Extracting the client name from the jobId (jobid -> clientuserid -> clientid -> clientname)
        const job = await ClientJob.findByPk(job_id);
        const clientUserId = job.client_user_id;
        const clientUser = await ClientUser.findByPk(clientUserId);
        const clientId = clientUser.client_id;
        const client = await Client.findByPk(clientId);
        const clientName = client.name;

        console.log('Job Title:', job.job_title);
        console.log('Client Name:', clientName);
        // batch send email to the shortlisted users
        const clientJobNotifications = await ClientJobNotification.findAll({
            where: {
                clientJobId: job_id,
            },
            include: [
                {
                    model: NotificationTemplate,
                    as: 'notificationTemplate',
                    required: true,
                }
            ]
        });
        if (clientJobNotifications && clientJobNotifications.length > 0) {
            // Check if any notification template has notification_use_case_id of 5
            const useCase7Template = clientJobNotifications.find(
                (notification) => notification.notificationTemplate.notification_use_case_id === 7
            );

            if (useCase7Template) {
                // Logic when a template with use case 5 is found
                console.log('Template with use case 7 exists.');
                // Send email using the found template with use case 5
                await sendJobDecisionEmail(
                    userDetails,
                    {
                        jobTitle: job.job_title,
                        jobId: job_id,
                        clientName: clientName
                    },
                    useCase7Template.notificationTemplate.id
                );
            } else {
                // Logic when no template with use case 7 is found
                console.log('No template with use case 7 found. Sending default template.');
                // Send email using the default template (id = 6
                await sendJobDecisionEmail(
                    userDetails,
                    {
                        jobTitle: job.job_title,
                        jobId: job_id,
                        clientName: clientName
                    },
                    6
                );
            }
        } else {
            // Logic when no ClientJobNotification found for the given job_id
            console.log('No ClientJobNotification found for the given job_id.');
            // Send email using the default template (id = 6)
            await sendJobDecisionEmail(
                userDetails,
                {
                    jobTitle: job.job_title,
                    jobId: job_id,
                    clientName: clientName
                },
                6
            );
        }
        res.status(200).json({ message: 'Users shortlisted successfully' });
    }
    catch (error) {
        console.error('Error shortlisting users:', error.message || error);
        res.status(500).json({ message: 'Error shortlisting users' });
    }
}

const rejectUsers = async (req, res) => {
    const job_id = req.body.job_id;
    const rejects = req.body.rejects;
    try {
        console.log('Rejects', rejects);
        // Fetching user details from the shortlist array
        const userIds = rejects.map(reject => reject.userId);
        // changing the userjob status to 'Rejected' for the rejected users
        await UserJob.update(
            { status: 'Rejected' },
            {
                where: {
                    user_id: userIds,
                    job_id
                }
            }
        );
        const detailedRejectedUsers = await Users.findAll({
            where: {
                id: userIds
            },
            attributes: ['id', 'firstName', 'lastName', 'email']
        });
        const userDetails = detailedRejectedUsers.map(user => ({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        }));
        console.log(userDetails);

        // Extracting the client name from the jobId (jobid -> clientuserid -> clientid -> clientname)
        const job = await ClientJob.findByPk(job_id);
        const clientUserId = job.client_user_id;
        const clientUser = await ClientUser.findByPk(clientUserId);
        const clientId = clientUser.client_id;
        const client = await Client.findByPk(clientId);
        const clientName = client.name;

        const clientJobNotifications = await ClientJobNotification.findAll({
            where: {
                clientJobId: job_id,
            },
            include: [
                {
                    model: NotificationTemplate,
                    as: 'notificationTemplate',
                    required: true,
                }
            ]
        });
        if (clientJobNotifications && clientJobNotifications.length > 0) {
            // Check if any notification template has notification_use_case_id of 5
            const useCase6Template = clientJobNotifications.find(
                (notification) => notification.notificationTemplate.notification_use_case_id === 6
            );

            if (useCase6Template) {
                // Logic when a template with use case 6 is found
                console.log('Template with use case 6 exists.');
                // Send email using the found template with use case 6
                await sendJobDecisionEmail(
                    userDetails,
                    {
                        jobTitle: job.job_title,
                        jobId: job_id,
                        clientName: clientName
                    },
                    useCase6Template.notificationTemplate.id
                );
            } else {
                // Logic when no template with use case 6 is found
                console.log('No template with use case 6 found. Sending default template.');
                // Send email using the default template (id = 7)
                await sendJobDecisionEmail(
                    userDetails,
                    {
                        jobTitle: job.job_title,
                        jobId: job_id,
                        clientName: clientName
                    },
                    7
                );
            }
        } else {
            // Logic when no ClientJobNotification found for the given job_id
            console.log('No ClientJobNotification found for the given job_id.');
            // Send email using the default template (id = 6)
            await sendJobDecisionEmail(
                userDetails,
                {
                    jobTitle: job.job_title,
                    jobId: job_id,
                    clientName: clientName
                },
                7
            );
        }
        res.status(200).json({ message: 'Users rejected successfully' });
    }
    catch (error) {
        console.error('Error rejecting users:', error.message || error);
        res.status(500).json({ message: 'Error rejecting users' });
    }
}
module.exports = {
    createUserJob,
    getUserJobs,
    updateUserJob,
    deleteUserJob,
    getUserJobsByJobId,
    shortlistUsers,
    rejectUsers
};
