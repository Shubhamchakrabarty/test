const { ClientJob, Interview, ClientJobInterview, ClientUser } = require('../models');
const crypto = require('crypto');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');

function encryptJobId(jobId, secretKey) {

  const iv = Buffer.from(secretKey.slice(0, 16)); // 16-byte IV directly from the key 
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKey), iv);

  let encrypted = cipher.update(jobId.toString());
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  // URL-safe Base64 encoding
  return encrypted.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function decryptJobId(token, secretKey) {
  token = token.replace(/-/g, '+').replace(/_/g, '/'); // Revert URL-safe encoding
  const iv = Buffer.from(secretKey.slice(0, 16));
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secretKey), iv);

  let decrypted = decipher.update(Buffer.from(token, 'base64'));
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return parseInt(decrypted.toString(), 10); // Return as integer
}

// Create a new ClientJob and a job link along with it 
const createClientJob = async (req, res) => {
  const { client_user_id, job_title, job_description, status } = req.body;
  console.log(`Received request to create client job: ${JSON.stringify(req.body)}`);
  const secretKey = process.env.ENCRYPTION_KEY;

  let transaction;
  try {
    transaction = await ClientJob.sequelize.transaction();

    const newClientJob = await ClientJob.create({
      client_user_id,
      job_title,
      job_description,
      status: status || 'Open', // Default status set as "Open"
      job_link: null
    }, { transaction });

    console.log(`Client job created with ID: ${newClientJob.id}`);

    const token = encryptJobId(newClientJob.id, secretKey);
    const baseUrl = process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : 'https://pehchaan.me';
    const jobLink = `${baseUrl}/jobApply/${token}`;

    newClientJob.job_link = jobLink;
    await newClientJob.save({ transaction });

    await transaction.commit();

    console.log(`New client job with link created: ${JSON.stringify(newClientJob)}`);
    res.status(201).json(newClientJob);

  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error('Error creating client job:', error.message || error);
    res.status(500).json({ message: 'Error creating client job' });
  }
};

// Get all ClientJobs
const getAllClientJobs = async (req, res) => {
  try {
    const clientJobs = await ClientJob.findAll();
    res.status(200).json(clientJobs);
  } catch (error) {
    console.error('Error fetching client jobs:', error.message || error);
    res.status(500).json({ message: 'Error fetching client jobs' });
  }
};

// Get a specific ClientJob by ID
const getClientJobById = async (req, res) => {
  const { id } = req.params;
  console.log(`Received request to fetch client job with ID: ${id}`);

  try {
    const clientJob = await ClientJob.findByPk(id);

    if (!clientJob) {
      return res.status(404).json({ message: 'Client job not found' });
    }

    res.status(200).json(clientJob);
  } catch (error) {
    console.error('Error fetching client job:', error.message || error);
    res.status(500).json({ message: 'Error fetching client job' });
  }
};

// Update a specific ClientJob by ID
const updateClientJob = async (req, res) => {
  const { id } = req.params;
  const { client_user_id, job_title, job_description, status, job_link } = req.body;
  console.log(`Received request to update client job with ID: ${id}`);

  try {
    const clientJob = await ClientJob.findByPk(id);

    if (!clientJob) {
      return res.status(404).json({ message: 'Client job not found' });
    }

    await clientJob.update({
      client_user_id,
      job_title,
      job_description,
      status,
      job_link
    });

    console.log(`Client job updated: ${JSON.stringify(clientJob)}`);
    res.status(200).json(clientJob);
  } catch (error) {
    console.error('Error updating client job:', error.message || error);
    res.status(500).json({ message: 'Error updating client job' });
  }
};

// Delete a specific ClientJob by ID
const deleteClientJob = async (req, res) => {
  const { id } = req.params;
  console.log(`Received request to delete client job with ID: ${id}`);

  try {
    const clientJob = await ClientJob.findByPk(id);

    if (!clientJob) {
      return res.status(404).json({ message: 'Client job not found' });
    }

    await clientJob.destroy();
    console.log(`Client job deleted with ID: ${id}`);
    res.status(204).send(); // No content response
  } catch (error) {
    console.error('Error deleting client job:', error.message || error);
    res.status(500).json({ message: 'Error deleting client job' });
  }
};

//Controller Logic for Fetching All Interviews for a Job:
const getInterviewsForJob = async (req, res) => {
  const { job_id } = req.params;
  console.log(`Fetching interviews for job ID: ${job_id}`);

  try {
    const jobInterviews = await ClientJobInterview.findAll({
      where: { job_id },
      include: [
        {
          model: Interview,
          as: 'interview',
          attributes: ['id', 'interview_name', 'interview_time_limit', 'time_limit_per_answer', 'status'],
        },
      ],
    });

    if (!jobInterviews.length) {
      return res.status(404).json({ message: 'No interviews found for this job.' });
    }

    // Return all job interviews with associated interview details and the job-interview ID
    const interviewsWithJobIds = jobInterviews.map(jobInterview => ({
      client_job_interview_id: jobInterview.id,
      client_job_interview_order: jobInterview.interview_order,
      question_set_selection_method: jobInterview.question_set_selection_method,
      question_set_fixed: jobInterview.question_set_fixed,
      number_of_question_sets: jobInterview.number_of_question_sets,
      interview: jobInterview.interview
    }));

    res.status(200).json(interviewsWithJobIds);
  } catch (error) {
    console.error('Error fetching interviews:', error.message || error);
    res.status(500).json({ message: 'Error fetching interviews for the job.' });
  }
};

// Fetch all jobs created by users of a specific client
const getJobsByClientId = async (req, res) => {
  const { clientId } = req.params; // Get client ID from the route parameters

  try {
    // Find all ClientUsers related to this clientId
    const clientUsers = await ClientUser.findAll({
      where: { client_id: clientId },
      attributes: ['id'], // We just need the user IDs
    });

    // Extract the user IDs from the clientUsers
    const clientUserIds = clientUsers.map(user => user.id);

    // Now find the jobs that are linked to these client user IDs
    const clientJobs = await ClientJob.findAll({
      where: {
        client_user_id: {
          [Op.in]: clientUserIds, // Match all jobs that belong to these users
        },
      },
      order: [['createdAt', 'DESC']], // Order jobs by most recent first
    });

    res.status(200).json(clientJobs);
  } catch (error) {
    console.error('Error fetching jobs by client ID:', error);
    res.status(500).json({ message: 'Error fetching jobs', error });
  }
};

const checkValidJobURL = async (req, res) => {
  const jobURL = req.params.jobURL; // token is passed as part of the URL
  const secretKey = process.env.ENCRYPTION_KEY;

  if (!jobURL) {
    return res.status(400).json({ message: 'Job link is missing. Please check the URL and try again.' });
  }

  let jobId;
  // First try to decrypt using the newer method (encryption-based)
  try {
    jobId = decryptJobId(jobURL, secretKey); // newer decryption approach (AES)
    if (isNaN(jobId) || jobId <= 0) {
      throw new Error('Invalid job link format');
    }
  } catch (error) {
    // If the newer method fails, try the older JWT-based method
    try {
      const { job_id } = jwt.verify(jobURL, process.env.JWT_SECRET_KEY); // older JWT-based verification
      jobId = job_id;
    } catch (error) {
      console.error('Error verifying job URL with both methods:', error.message || error);
      return res.status(400).json({
        message: 'Invalid job link. Please check the URL and try again.'
      });
    }
  }

  // Now that we have the jobId (either from new or old method), look for the job in the database
  try {
    const clientJob = await ClientJob.findByPk(jobId);

    if (!clientJob) {
      return res.status(404).json({ message: 'This job either has been deleted or is invalid.' });
    }

    res.status(200).json({ message: 'Valid Job URL', job: clientJob });
  } catch (error) {
    console.error('Error finding job in the database:', error.message || error);
    return res.status(500).json({
      message: 'An error occurred while verifying the job link. Please try again.'
    });
  }
};


// Updates the job link for an existing job with a valid / fresh job link
const generateJobLinkForExistingJob = async (req, res) => {
  const { job_id } = req.params; // Job ID passed in the URL
  const secretKey = process.env.ENCRYPTION_KEY;

  try {
    // Step 1: Fetch the job entry from the database
    const job = await ClientJob.findByPk(job_id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    // Step 2: Generate the JWT and job link
    // const payload = { job_id: job.id };
    // const token = jwt.sign(payload, secretKey); 
    const token = encryptJobId(job_id, secretKey);
    const baseUrl = process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : 'https://pehchaan.me';
    const jobLink = `${baseUrl}/jobApply/${token}`;

    // Step 3: Update the job entry with the new link
    job.job_link = jobLink;
    await job.save();

    res.status(200).json({ message: 'Job link created successfully', job });

  } catch (error) {
    console.error('Error generating job link:', error.message || error);
    res.status(500).json({ message: 'Error generating job link' });
  }
};

module.exports = {
  createClientJob,
  getAllClientJobs,
  getClientJobById,
  updateClientJob,
  deleteClientJob,
  getInterviewsForJob,
  getJobsByClientId,
  checkValidJobURL,
  generateJobLinkForExistingJob
};
