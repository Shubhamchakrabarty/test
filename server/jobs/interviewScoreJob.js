const { Queue } = require('bullmq');
const IORedis = require('ioredis');
const { calculateQuestionLevelScore, calculateInterviewLevelScore, calculateTypingScore } = require('../services/interviewScoringService');
const { saveQuestionScore, saveInterviewScore, saveQuestionScoreInterviewTotal } = require('../services/saveData');
const { InterviewResponse, Users, AnswerTranscript, InterviewQuestion, InterviewEvaluationCriteria, JobInterviewEvaluationCategory, Question, ClientJobInterview, InterviewInstructions } = require('../models');

// Setup Redis connection
const connection = new IORedis({
  host: '127.0.0.1',
  port: 6379,
});

// Initialize the queue
const interviewScoreQueue = new Queue('interviewScoreQueue', { connection });

// Function to add jobs to the queue
const addInterviewScoreJob = (jobData) => {
  return interviewScoreQueue.add('interviewScore', jobData);  // Add job with a name 'interviewScore'
};


// Function to process the job
const processInterviewScore = async (jobData) => {
  const { userClientJobInterviewAttemptId, clientJobInterviewId, userId } = jobData;
  console.log("Scoring interview for User ID:", userId, "Attempt ID:", userClientJobInterviewAttemptId);

  try {
    const user = await Users.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('No user found with ID: ' + userId);
    }

    // Fetch the interview_id from the ClientJobInterview model using clientJobInterviewId
    const clientJobInterview = await ClientJobInterview.findOne({
      where: { id: clientJobInterviewId },
      attributes: ['interview_id'] // Only fetch the interview_id
    });

    if (!clientJobInterview) {
      throw new Error(`No ClientJobInterview found with ID: ${clientJobInterviewId}`);
    }

    const interviewId = clientJobInterview.interview_id;

    // Fetch the context_video_text from the InterviewInstructions model using interviewId
    const interviewInstructions = await InterviewInstructions.findOne({ 
      where: { interview_id: interviewId }
    });

    // Pass "No additional context provided to candidates" if context_video_text is null
    const contextVideoText = interviewInstructions && interviewInstructions.context_video_text
      ? interviewInstructions.context_video_text
      : "No additional context provided to candidates";

    // Fetch the evaluation criteria for the interview
    const evaluationCriteria = await InterviewEvaluationCriteria.findAll({
        where: { client_job_interview_id: clientJobInterviewId },
        include: [{
          model: JobInterviewEvaluationCategory,
          as: 'evaluation_category',
          attributes: ['id','name', 'evaluation_level', 'description'] // Fetch name and evaluation level
        }]
      });

    console.log('Evaluation Criteria:', JSON.stringify(evaluationCriteria, null, 2));

    // Retrieve the interview responses for the given attempt
    const interviewResponses = await InterviewResponse.findAll({
        where: { user_client_job_interview_attempt_id: userClientJobInterviewAttemptId },
        attributes: [
          'id', 
          'user_id', 
          'user_client_job_interview_attempt_id', 
          'interview_question_id', 
          'follow_up_question_id', 
          'answer_transcription_id'
        ]
      });
    
    //console.log('Interview Responses:', JSON.stringify(interviewResponses, null, 2));


    // Process each evaluation criterion
    for (const criteria of evaluationCriteria) {
        const { name: skillName, evaluation_level: scoringLevel, id: evaluationCategoryId} = criteria.evaluation_category;
        console.log(`Processing criteria for skill: ${skillName}, Scoring Level: ${scoringLevel}`);
  
        if (scoringLevel === 'question') {
          // Fetch and process each response at the question level

          
          for (const response of interviewResponses) {
            let combinedTranscriptWithQuestion = '';
            const transcript = await AnswerTranscript.findOne({ where: { id: response.answer_transcription_id } });
            const interviewData = transcript ? transcript.transcript : null;
        
            const interviewQuestion = await InterviewQuestion.findOne({
              where: { id: response.interview_question_id },
              include: [{ model: Question, as: 'question', attributes: ['question_text'] }]
            });

            if (interviewData && interviewQuestion && interviewQuestion.question.question_text){
              combinedTranscriptWithQuestion+= `Question: ${interviewQuestion.question.question_text}\nAnswer: ${interviewData}\n\n`;
              // Call scoring service for question-level evaluation
              const scores = await calculateQuestionLevelScore(clientJobInterviewId, evaluationCategoryId, skillName, response.interview_question_id, combinedTranscriptWithQuestion, contextVideoText);
              if (scores) {
                // Save the question-level score if it was computed successfully
                await saveQuestionScore(userClientJobInterviewAttemptId, response.id, evaluationCategoryId, scores);
                console.log(`Saved question-level score for attempt ID ${userClientJobInterviewAttemptId}, question ID ${response.interview_question_id}`);
              } else {
                console.warn(`Skipping saving for question-level evaluation for skill: ${skillName}, as no score was computed`);
              }
            } else {
              console.warn(`No transcription data found for response ID: ${response.id}`);
            }
          }
          // After processing all question-level assessments, calculate and save the total score
          await saveQuestionScoreInterviewTotal(userClientJobInterviewAttemptId, evaluationCategoryId);
        } else if (scoringLevel === 'interview') {

          if (skillName === 'Typing Speed - WPM' || skillName === 'Typing Speed - Accuracy') {
            console.log(`Interview-level evaluation for ${skillName}: Handling questions and transcripts differently.`);
            // Create arrays for transcripts and questions
            const transcriptsArray = [];
            const questionsArray = [];
            let totalTimeTaken = 0;

            for (const response of interviewResponses) {
              const transcript = await AnswerTranscript.findOne({ where: { id: response.answer_transcription_id } });
              const interviewQuestion = await InterviewQuestion.findOne({
                where: { id: response.interview_question_id },
                include: [{ model: Question, as: 'question', attributes: ['question_text'] }]
              });

              if (transcript && transcript.transcript && interviewQuestion && interviewQuestion.question.question_text) {
                transcriptsArray.push(transcript.transcript);
                questionsArray.push(interviewQuestion.question.question_text);
                totalTimeTaken += transcript.time_taken_to_answer || 0;
              } else {
                console.warn(`Missing data for response ID: ${response.id}`);
              }
            }

            // Call typing scoring service with arrays of questions and transcripts
            const typingScores = await calculateTypingScore(clientJobInterviewId, evaluationCategoryId, skillName, questionsArray, transcriptsArray, totalTimeTaken);
            if (typingScores) {
              const { gross_speed_wpm, accuracy, total_words, total_words_accuracy, total_errors, total_time_taken } = typingScores;
              // Save Typing Speed - WPM score
              if (skillName === 'Typing Speed - WPM') {
                await saveInterviewScore(userClientJobInterviewAttemptId, evaluationCategoryId, {
                    skillName: 'Typing Speed - WPM',
                    score:{
                      score: gross_speed_wpm,
                      qualitative_assessment: {
                        total_words_for_speed: total_words,
                        total_time_taken,
                        gross_speed_wpm,
                      },
                    }
                    
                });
                console.log(`Saved Typing Speed - WPM score for attempt ID ${userClientJobInterviewAttemptId}`);
              }
              // Save Typing Speed - Accuracy score
              if (skillName === 'Typing Speed - Accuracy') {
                await saveInterviewScore(userClientJobInterviewAttemptId, evaluationCategoryId, {
                    skillName: 'Typing Speed - Accuracy',
                    score: {
                      score: accuracy,
                      qualitative_assessment: {
                        total_words_for_accuracy: total_words_accuracy,
                        total_errors,
                        accuracy,
                      },
                    }
                    
                });
                console.log(`Saved Typing Speed - Accuracy score for attempt ID ${userClientJobInterviewAttemptId}`);
              }
            } else {
              console.warn(`Skipping saving for typing evaluation for skill: ${skillName}, as no score was computed`);
            }
          } else{

            console.log('Interview-level evaluation: Combine responses and prepare for scoring.');
            // Combine questions and transcripts for interview-level evaluation
            let combinedTranscriptWithQuestions = '';
            let hasValidTranscripts = false; // Flag to track valid transcript existence

            for (const response of interviewResponses) {
            const transcript = await AnswerTranscript.findOne({ where: { id: response.answer_transcription_id } });

            // Fetch the corresponding question text and order
            const interviewQuestion = await InterviewQuestion.findOne({
                where: { id: response.interview_question_id },
                include: [{ model: Question, as: 'question', attributes: ['question_text'] }]
            });

            if (interviewQuestion && interviewQuestion.question.question_text) {
              if (transcript && transcript.transcript) {
                  combinedTranscriptWithQuestions += `Question ${interviewQuestion.question_order}: ${interviewQuestion.question.question_text}\nAnswer: ${transcript.transcript}\n\n`;
                  hasValidTranscripts = true; // Mark that we have at least one valid transcript
              } else {
                  // Append placeholder text for unanswered questions
                  combinedTranscriptWithQuestions += `Question ${interviewQuestion.question_order}: ${interviewQuestion.question.question_text}\nAnswer: Candidate has not attempted this question.\n\n`;
              }
            } else {
                console.warn(`No data found for response ID: ${response.id}`);
            }
          }

            //console.log(`Combined Transcript with Questions for Interview-Level Evaluation:\n`, combinedTranscriptWithQuestions);

            // If no valid transcripts, skip the scoring process and log a warning
            if (!hasValidTranscripts) {
              console.warn(`No valid transcripts found for interview attempt: ${userClientJobInterviewAttemptId}. Skipping interview-level scoring.`);
              continue; // Move to the next evaluation category
            }
            // Call scoring service for interview-level evaluation
            const scores = await calculateInterviewLevelScore(clientJobInterviewId, evaluationCategoryId, skillName, combinedTranscriptWithQuestions, contextVideoText);
            if (scores) {
              // Save the interview-level score if it was computed successfully
              await saveInterviewScore(userClientJobInterviewAttemptId, evaluationCategoryId, scores);
              console.log(`Saved interview-level score for attempt ID ${userClientJobInterviewAttemptId}`);
            } else {
              console.warn(`Skipping saving for interview-level evaluation for skill: ${skillName}, as no score was computed`);
            }

          }

            
        }
      // Handle job-level evaluation similarly if required
      }
  
      return true;
    } catch (error) {
      console.error('Error scoring interview:', error);
      throw error;
    }
  };

module.exports = { addInterviewScoreJob, processInterviewScore };
