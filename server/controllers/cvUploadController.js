const { addParseCvJob } = require('../jobs/parseCvJob');
const { CvUploadUserJob, UserJob } = require('../models');

const uploadCvFile = async (req, res) => {
  try {
    const { user_id, job_id, socketId } = req.body; // Add job_id and socketId
    const file_url = req.file ? req.file.location : null;

    if (!file_url) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    // Save the CV URL in the CvUploadUserJob model
    await CvUploadUserJob.create({
      user_id,
      job_id,
      file_url,
    });

    // Enqueue the job for background processing
    await addParseCvJob({ user_id, job_id, file_url, socketId }); // Pass job_id and socketId

    // Respond to the user immediately
    res.status(200).json({ message: 'File uploaded successfully. Processing is underway.', file_url });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ message: 'Error uploading file' });
  }
};

const checkCvUpload = async (req, res) => {
  const { userId, jobId } = req.params; // Add jobId
  try {
    const cvUpload = await CvUploadUserJob.findOne({ where: { user_id: userId, job_id: jobId } });
    if (cvUpload) {
      return res.status(200).json({ uploaded: true, file_url: cvUpload.file_url });
    } else {
      return res.status(200).json({ uploaded: false });
    }
  } catch (error) {
    console.error('Error checking CV upload:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Check if CV is uploaded for all jobs for a particular user job based on user_id 
const checkCvUploadForAllJobs = async (req, res) => {
  const { userId } = req.params;
  try {
    const cvUploads = await CvUploadUserJob.findAll({ where: { user_id: userId } });
    if (cvUploads.length > 0) {
      return res.status(200).json({
        uploaded: true,
        details: cvUploads.map(cvUpload => ({
          job_id: cvUpload.job_id,
          file_url: cvUpload.file_url
        }))
      });
    }
    return res.status(200).json({ uploaded: false });
  } catch (error) {
    console.error('Error checking CV upload for all jobs:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Check if CV is uploaded for all jobs for a particular user job based on user_id 
const deleteUserJobCV = async (req, res) => {
  const { userId, jobId } = req.params;
  try {
    const cvUploads = await CvUploadUserJob.destroy({ where: { user_id: userId, job_id: jobId } });
    if (cvUploads === 0) {
      return res.status(404).json({ message: 'No CVs found for the user and job'});
    }
    return res.status(200).json({ message: `Deleted CVs for the user_id: ${userId} and job_id: ${jobId}` });

  } catch (error) {
    console.error('Error checking CV upload for all jobs:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  uploadCvFile,
  checkCvUpload,
  checkCvUploadForAllJobs,
  deleteUserJobCV
};