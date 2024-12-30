const { Queue } = require('bullmq');
const IORedis = require('ioredis');
const { createClient } = require('@deepgram/sdk');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { GetObjectCommand } = require('@aws-sdk/client-s3');
const {s3} = require('../config/s3Config'); // Import the configured S3 client
const { saveTranscription } = require('../services/saveData');
const { UserClientJobInterviewAttempt, InterviewResponse, ClientJobInterview, Interview, InterviewInstructions } = require('../models');
//const interviewScoreQueue = require('./interviewScoreJob');  // Import the scoring queue
const { addInterviewScoreJob } = require('./interviewScoreJob'); 
const { calculatePronunciationAccuracy, calculateFluencyMetrics, calculateConfidenceMetrics } = require('../utils/languageFluency');


// Setup Redis connection
const connection = new IORedis({
  host: '127.0.0.1',
  port: 6379,
});

// Initialize the queue
const transcribeAudioQueue = new Queue('transcribeAudioQueue', { connection });

// Function to add jobs to the queue
const addTranscribeAudioJob = (jobData) => {
  return transcribeAudioQueue.add('transcribeAudio', jobData);  // Add job with a name 'interviewScore'
};

const getFileUrl = async (fileUrl) => {

  if (!fileUrl) {
    throw new Error('File URL is not provided or invalid.');
  }
  const bucketName = process.env.NODE_ENV === 'production' ? process.env.S3_AUDIO_ANSWER_BUCKET_NAME_PROD : process.env.S3_AUDIO_ANSWER_BUCKET_NAME_DEV;
  const key = decodeURIComponent(fileUrl.split('/').pop());

  // Create a command to retrieve the object
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  // Generate the signed URL with an expiration time (e.g., 3600 seconds = 1 hour)
  const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });

  return signedUrl;
};

const transcribeAudioWithDeepgram = async (url, language_code) => {
  const deepgramApiKey = process.env.DEEPGRAM_API_KEY;
  const deepgram = createClient(deepgramApiKey);

  const { result, error } = await deepgram.listen.prerecorded.transcribeUrl(
    { url },
    { smart_format: true, filler_words: true, model: 'nova-2', language: language_code}
  );

  if (error) throw error;
  if (!result) throw new Error('No transcription result returned by Deepgram');
  return result;
};
/*
const updateInterviewCompletionStatus = async (userClientJobInterviewAttemptId) => {
  try {
    await UserClientJobInterviewAttempt.update(
      { interview_completed: true },  // Mark interview as completed
      { where: { id: userClientJobInterviewAttemptId } }
    );
    console.log('Interview marked as completed:', userClientJobInterviewAttemptId);
  } catch (error) {
    console.error('Error updating interview completion status:', error);
    throw new Error('Failed to update interview completion status');
  }
};
*/


// Function to process the job
const processTranscribeAudio = async (jobData) => {
  let { audio_upload_id, file_url, user_client_job_interview_attempt_id, isLastQuestion } = jobData;
  console.log('Data Received in transcribeAudioQueue');
  console.log('user_client_job_interview_attempt_id:', user_client_job_interview_attempt_id);
  console.log('isLastQuestion(raw):',isLastQuestion, 'Type:', typeof isLastQuestion);
  try {
    // Ensure isLastQuestion is explicitly a boolean
    if (typeof isLastQuestion !== 'boolean') {
      isLastQuestion = (isLastQuestion === true || isLastQuestion === 'true' || isLastQuestion === 1 || isLastQuestion === '1'); // Convert to true/false if it's a string or number
    }
    console.log('isLastQuestion (converted to boolean):', isLastQuestion);

    // Get the signed URL for the file
    const signedUrl = await getFileUrl(file_url);
    console.log('Signed URL fetched:', signedUrl);

    // Fetch the language from the InterviewInstructions
    const attemptForLanguage = await UserClientJobInterviewAttempt.findOne({
      where: { id: user_client_job_interview_attempt_id },
      include: [
        {
          model: ClientJobInterview,
          as: 'client_job_interview',
          include: [
            {
              model: Interview,
              as: 'interview',
              include: [
                {
                  model: InterviewInstructions,
                  as: 'instructions',
                },
              ],
            },
          ],
        },
      ],
    });

    let language_code = 'en-IN';  // Default language

    if (!attemptForLanguage || !attemptForLanguage.client_job_interview || !attemptForLanguage.client_job_interview.interview || !attemptForLanguage.client_job_interview.interview.instructions) {
      console.warn(`No valid instructions found, using default language: ${language_code}`);
    } else {
      language_code = attemptForLanguage.client_job_interview.interview.instructions.language || language_code;
      console.log(`Language for transcription: ${language_code}`);
    }


    // Transcribe audio using Deepgram
    const transcriptionData = await transcribeAudioWithDeepgram(signedUrl, language_code);
    //console.log('Transcription Data:', transcriptionData);
    const words = transcriptionData.results.channels[0].alternatives[0].words;

    const transcript = transcriptionData.results.channels[0].alternatives[0].transcript;
    const confidence_score = transcriptionData.results.channels[0].alternatives[0].confidence;
    const duration = transcriptionData.metadata.duration;
    

    // Optionally, log transcript
    console.log('Transcript:', transcript);

    // Calculate Analytics
    const pronunciationAccuracy = calculatePronunciationAccuracy(words);
    const { wordsPerMinute, pauses, longPauses } = calculateFluencyMetrics(words, duration, 1.0, 3.0);
    const clarity = calculateConfidenceMetrics(words);

    console.log('Analytics:');
    console.log(`Pronunciation Accuracy: ${pronunciationAccuracy}%`);
    console.log(`Fluency - WPM: ${wordsPerMinute}, Pauses: ${pauses}, Long Pauses: ${longPauses}`);
    console.log(`Confidence & Clarity: ${clarity}%`);


    // Save transcription to the database
    await saveTranscription(audio_upload_id, transcript, confidence_score, duration, user_client_job_interview_attempt_id, {
      pronunciationAccuracy,
      wordsPerMinute,
      pauses,
      longPauses,
      clarity,
    });
    console.log('Transcription saved successfully');

    // If it's the last question, trigger the scoring job
    if (isLastQuestion === true) {

      console.log('Last question detected, triggering scoring job for user_client_job_interview_attempt_id:', user_client_job_interview_attempt_id);
      
      // Pre-process (retrieve necessary IDs for scoring)
      const attempt = await UserClientJobInterviewAttempt.findOne({
        where: { id: user_client_job_interview_attempt_id },
        include: [{
          model: InterviewResponse,
          as: 'interview_responses',
          attributes: [
            'id', 
            'user_id', 
            'user_client_job_interview_attempt_id', 
            'interview_question_id', 
            'follow_up_question_id', 
            'answer_transcription_id'
          ]
        }]
      });

      if (!attempt) {
        throw new Error('Interview attempt not found');
      }

      const { client_job_interview_id, user_id } = attempt;

      // Trigger scoring job
      console.log('Scoring Queue Triggered');
      
      await addInterviewScoreJob({
        userClientJobInterviewAttemptId: user_client_job_interview_attempt_id,
        clientJobInterviewId: client_job_interview_id,
        userId: user_id
      });

      // Mark the interview attempt as completed- now being handled in the audio upload controller
      //await updateInterviewCompletionStatus(user_client_job_interview_attempt_id);
      
    }


  } catch (error) {
    console.error('Error processing transcription:', error);
  }
};

module.exports = { addTranscribeAudioJob, processTranscribeAudio };
