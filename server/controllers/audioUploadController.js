const { AnswerAudioUpload, UserClientJobInterviewAttempt } = require('../models'); // Replace with your model
//const transcribeAudioQueue = require('../jobs/transcribeAudioJob');
const { addTranscribeAudioJob } = require('../jobs/transcribeAudioJob');

const uploadAudioFile = async (req, res) => {
  try {
    let { user_id, socketId, interview_question_id, time_taken_to_answer, user_client_job_interview_attempt_id, isLastQuestion=false } = req.body;
    const file_url = req.file ? req.file.location : null;
    console.log('Data Received in audio upload controller');
    console.log('user_client_job_interview_attempt_id:',user_client_job_interview_attempt_id );
    console.log('interview_question_id:',interview_question_id);
    console.log('isLastQuestion:',isLastQuestion);
    


    if (!file_url) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    if (!interview_question_id) {
      return res.status(400).json({ message: 'Interview Question Id not shared' });
    }

    if (!time_taken_to_answer) {
      return res.status(400).json({ message: 'Time taken to answer not shared' });
    }

    // Ensure isLastQuestion is explicitly a boolean
    if (typeof isLastQuestion !== 'boolean') {
      isLastQuestion = (isLastQuestion === true || isLastQuestion === 'true' || isLastQuestion === 1 || isLastQuestion === '1'); // Convert to true/false if it's a string or number
    }
    console.log('isLastQuestion (converted to boolean):', isLastQuestion);

    // Save the audio URL in the database
    const audioUpload = await AnswerAudioUpload.create({
      user_id,
      file_url,
      interview_question_id,
      time_taken_to_answer,
    });
    // Check if the audioUpload object was successfully created
    if (!audioUpload) {
      throw new Error('Failed to upload and process audio');
    }

    // Add the job to the transcription queue
    await addTranscribeAudioJob({ 
      audio_upload_id: audioUpload.id, 
      file_url, 
      user_client_job_interview_attempt_id,
      socketId,
      isLastQuestion, // Pass the flag to handle last question logic in the queue
    });

     // If it's the last question, mark the interview attempt as completed
     if (isLastQuestion) {
      await UserClientJobInterviewAttempt.update(
        { interview_completed: true },
        { where: { id: user_client_job_interview_attempt_id } }
      );
    }

    

    res.status(200).json({ message: 'File uploaded successfully. Transcription is underway.', file_url });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ message: 'Error uploading file' });
  }
};

module.exports = {
  uploadAudioFile,
};
