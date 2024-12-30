const { Queue } = require('bullmq');
const IORedis = require('ioredis');
const { calculateFinalScore } = require('../services/profileScoringService');
const { saveScore } = require('../services/saveData');
const { getEducationData, getInternshipsByUserId, getJobsByUserId, getProjectsByUserId } = require('../services/dataFetchService');

// Setup Redis connection
const connection = new IORedis({
  host: '127.0.0.1',
  port: 6379,
});

const scoreProfileQueue = new Queue('scoreProfileQueue', { connection });

// Function to add jobs to the queue
const addScoreProfileJob = (jobData) => {
  return scoreProfileQueue.add('scoreProfile', jobData);
};

// Function to process the job
const processScoreProfile = async (jobData) => {
  const { user_id, user_type } = jobData;
  console.log("Scoring Input Data: User ID: ",{user_id}, " User Type: ", {user_type});
  try {
    const educationData = await getEducationData(user_id);
    const internshipsData = await getInternshipsByUserId(user_id);
    const workExperienceData = await getJobsByUserId(user_id);
    const projectsData = await getProjectsByUserId(user_id);

    const data = { educationData, internshipsData, workExperienceData, projectsData };

    const { scores, weights } = await calculateFinalScore(user_id, user_type, data);
    console.log('Final Profile Score:', scores.final);

    await saveScore(user_id, scores, weights);

    console.log('Profile scoring complete');
    return scores;
  } catch (error) {
    console.error('Error scoring profile:', error);
    throw error;
  }
};

module.exports = { addScoreProfileJob, processScoreProfile };