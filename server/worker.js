const { Worker } = require('bullmq');
const { Resend } = require('resend');
const IORedis = require('ioredis');

const { processParseCv } = require('./jobs/parseCvJob');
const { processInterviewScore } = require('./jobs/interviewScoreJob');
const { processScoreProfile } = require('./jobs/scoreProfileJob');
const { processTranscribeAudio } = require('./jobs/transcribeAudioJob');
const { processEmailSend, processBatchEmailSend } = require('./jobs/emailSendJob');

// Setup Redis connection
const connection = new IORedis({
  host: '127.0.0.1',
  port: 6379,
  maxRetriesPerRequest: null,
});

console.log('Worker started');

// Setup Worker for parseCvQueue
const parseCvWorker = new Worker('parseCvQueue', async (job) => {
  try {
    // Call the processing logic for interview score
    await processParseCv(job.data);
    console.log(`Job ${job.id} completed successfully!`);
  } catch (error) {
    console.error(`Job ${job.id} failed:`, error.message);
  }
}, { connection, concurrency: 5 });


// Setup Worker for interviewScoreQueue
const interviewScoreWorker = new Worker('interviewScoreQueue', async (job) => {
  try {
    // Call the processing logic for interview score
    await processInterviewScore(job.data);
    console.log(`Job ${job.id} completed successfully!`);
  } catch (error) {
    console.error(`Job ${job.id} failed:`, error.message);
  }
}, { connection, concurrency: 5 });

// Setup Worker for scoreProfileQueue
const scoreProfileWorker = new Worker('scoreProfileQueue', async (job) => {
  try {
    // Call the processing logic for interview score
    await processScoreProfile(job.data);
    console.log(`Job ${job.id} completed successfully!`);
  } catch (error) {
    console.error(`Job ${job.id} failed:`, error.message);
  }
}, { connection, concurrency: 5 });

// Setup Worker for transcribeAudioQueue
const transcribeAudioWorker = new Worker('transcribeAudioQueue', async (job) => {
  try {
    // Call the processing logic for interview score
    await processTranscribeAudio(job.data);
    console.log(`Job ${job.id} completed successfully!`);
  } catch (error) {
    console.error(`Job ${job.id} failed:`, error.message);
  }
}, { connection, concurrency: 5 });

// Setup Worker for emailQueue
const emailWorker = new Worker('emailQueue', async (job) => {
  try {
    await processEmailSend(job.data);
    console.log(`Job ${job.id} completed successfully!`);
  } catch (error) {
    console.error(`Job ${job.id} failed:`, error.message);
  }
}, { connection, concurrency: 5 });

// Setup Worker for sending batch emails  
const batchEmailWorker = new Worker('batchEmailQueue', async (job) => {
  console.log('Processing batch email job:', job.data);
  try {
    await processBatchEmailSend(job.data);
    console.log(`Job ${job.id} completed successfully!`);
  } catch (error) {
    console.error(`Job ${job.id} failed:`, error.message);
  }
}, { connection, concurrency: 5 });