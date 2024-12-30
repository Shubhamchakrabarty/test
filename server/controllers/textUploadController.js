// Import required models and scoring job
const { AnswerTextUpload, InterviewResponse, AnswerTranscript, UserClientJobInterviewAttempt } = require('../models');
const { addInterviewScoreJob } = require('../jobs/interviewScoreJob');
const { saveTextAnswerToInterviewResponse } = require('../services/saveData');

// Controller function to handle text response upload
const uploadTextAnswer = async (req, res) => {
  try {
    // Extract data from request body
    let {
      user_id,
      interview_question_id,
      user_client_job_interview_attempt_id,
      answer_text,
      time_taken_to_answer,
      isLastQuestion = false,
    } = req.body;

    // Validate required fields
    if (!user_id || !interview_question_id || !user_client_job_interview_attempt_id) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Ensure isLastQuestion is explicitly a boolean
    if (typeof isLastQuestion !== 'boolean') {
      isLastQuestion = (isLastQuestion === true || isLastQuestion === 'true' || isLastQuestion === 1 || isLastQuestion === '1'); // Convert to true/false if it's a string or number
    }
    console.log('isLastQuestion (converted to boolean):', isLastQuestion);

    // Create new entry in AnswerTextUpload
    const textUpload = await AnswerTextUpload.create({
      user_id,
      interview_question_id,
      answer_text: answer_text || '',
      time_taken_to_answer,
    });

    // Create new entry in AnswerTranscript
    const answerTranscript = await AnswerTranscript.create({
      answer_text_upload_id: textUpload.id,
      transcript: answer_text || '',
      time_taken_to_answer,
      response_type: 'text',
      service_used: 'NA',
    });

    // Save the answer to InterviewResponse using the service function
    const saveResult = await saveTextAnswerToInterviewResponse(user_id, interview_question_id, user_client_job_interview_attempt_id, answerTranscript.id);
    if (!saveResult.success) {
      console.warn(saveResult.message);
    }

    // If it's the last question, trigger the scoring job
    if (isLastQuestion) {
      // Retrieve clientJobInterviewId from UserClientJobInterviewAttempt
      const attempt = await UserClientJobInterviewAttempt.findOne({
        where: { id: user_client_job_interview_attempt_id },
        attributes: ['client_job_interview_id'],
      });

      if (!attempt) {
        throw new Error('Interview attempt not found');
      }

      const clientJobInterviewId = attempt.client_job_interview_id;

      // Trigger the scoring job
      await addInterviewScoreJob({
        userClientJobInterviewAttemptId: user_client_job_interview_attempt_id,
        clientJobInterviewId: clientJobInterviewId,
        userId: user_id,
      });

      // Mark the interview attempt as completed
      await UserClientJobInterviewAttempt.update(
        { interview_completed: true },
        { where: { id: user_client_job_interview_attempt_id } }
      );
    }

    // Respond with success message
    res.status(200).json({ message: 'Text answer uploaded successfully', textUpload });
  } catch (error) {
    console.error('Error uploading text answer:', error);
    res.status(500).json({ message: 'Error uploading text answer' });
  }
};

module.exports = {
  uploadTextAnswer,
};