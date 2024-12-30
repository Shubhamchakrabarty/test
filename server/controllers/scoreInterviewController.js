//const interviewScoreQueue = require('../jobs/interviewScoreJob');
const { addInterviewScoreJob } = require('../jobs/interviewScoreJob');
const { UserJob, AnswerAudioUpload, Users, UserClientJobInterviewAttempt, InterviewResponse, ClientJobInterview, Interview, InterviewEvaluationCriteria, JobInterviewEvaluationCategory, JobInterviewLevelAssessment, JobInterviewQuestionLevelAssessment, JobInterviewQuestionLevelAssessmentTotalScore, InterviewQuestion, Question, AnswerTranscript, VideoUpload } = require('../models');
const { formatFeedback } = require('../utils/customLLMOutputJsonUtils');
const { generatePresignedUrl } = require('../config/s3Config');
const { sequelize } = require('../models');

const scoreInterview = async (req, res) => {
  try {
    const { userClientJobInterviewAttemptId } = req.params;

    if (!userClientJobInterviewAttemptId) {
      return res.status(400).json({ message: 'userClientJobInterviewAttemptId is required' });
    }

    // Retrieve the UserClientJobInterviewAttempt to get the related clientJobInterviewId and userId
    const attempt = await UserClientJobInterviewAttempt.findOne({
      where: { id: userClientJobInterviewAttemptId },
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
      return res.status(404).json({ message: 'Interview attempt not found' });
    }

    const { client_job_interview_id, user_id } = attempt;

    // Enqueue the job for background processing with the necessary IDs
    await addInterviewScoreJob({ userClientJobInterviewAttemptId, clientJobInterviewId: client_job_interview_id, userId: user_id });

    res.status(200).json({ message: 'Interview scoring job added to the queue', data: { userClientJobInterviewAttemptId, clientJobInterviewId: client_job_interview_id, userId: user_id, attempt: attempt } });
  } catch (error) {
    console.error('Error scoring interview:', error);
    res.status(500).json({ message: 'Error scoring interview' });
  }
};

const getJobInterviewScoresForUser = async (req, res) => {
  try {
    const { userId, clientJobId } = req.params;

    // Step 1: Find All Interviews Linked to the Job
    const interviews = await ClientJobInterview.findAll({
      where: { job_id: clientJobId },
      include: [
        {
          model: Interview,
          as: 'interview',
          attributes: ['id', 'interview_name']
        }
      ],
      attributes: ['id', 'interview_order']
    });

    if (!interviews.length) {
      return res.status(404).json({ message: 'No interviews found for this job' });
    }

    const interviewDetails = await Promise.all(interviews.map(async (interview) => {
      const clientJobInterviewId = interview.id;
      const interviewName = interview.interview.interview_name;
      const interviewOrder = interview.interview_order;

      // Step 2: Find the Latest COMPLETED Attempt for the Interview
      const latestAttempt = await UserClientJobInterviewAttempt.findOne({
        where: { user_id: userId, client_job_interview_id: clientJobInterviewId },
        order: [['createdAt', 'DESC']]
      });

      let status;
      let interviewLevelEvaluation = [];
      let questionLevelEvaluation = [];
      let interviewResponseDetails = [];

      if (!latestAttempt) {
        status = "User has not attempted this interview";
      } else if (latestAttempt.interview_completed) {
        status = "User has completed this interview";

        // Fetch evaluation categories and their levels for the completed interview
        const evaluationCategories = await InterviewEvaluationCriteria.findAll({
          where: { client_job_interview_id: clientJobInterviewId },
          include: [
            {
              model: JobInterviewEvaluationCategory,
              as: 'evaluation_category',
              attributes: ['id', 'name', 'evaluation_level']
            }
          ]
        });

        // Fetch question-level scores for the completed interview
        const interviewResponses = await InterviewResponse.findAll({
          where: { user_client_job_interview_attempt_id: latestAttempt.id },
          attributes: ['id', 'interview_question_id', 'answer_transcription_id'],
          include: [
            {
              model: AnswerTranscript,
              as: 'answer_transcription',
              attributes: ['transcript'],
            },
            {
              model: InterviewQuestion,
              as: 'interview_question',
              attributes: ['question_order'],
              include: [
                {
                  model: Question,
                  as: 'question',
                  attributes: ['question_text']
                }
              ]
            }
          ]
        });

        // Populate interview-response-details with question, order, and transcript
        interviewResponseDetails = interviewResponses.map(response => ({
          questionOrder: response?.interview_question?.question_order || 'Unknown Order',
          questionText: response?.interview_question?.question?.question_text || 'Unknown Question',
          userResponse: response?.answer_transcription?.transcript || 'No transcript available'
        }));


        // Fetch interview-level scores for the completed interview
        const interviewLevelScores = await sequelize.query(`
          SELECT DISTINCT ON ("evaluation_category_id") "evaluation_category_id", "score", "feedback", "createdAt"
          FROM "JobInterviewLevelAssessments"
          WHERE "user_client_job_interview_attempt_id" = :attemptId
          ORDER BY "evaluation_category_id", "createdAt" DESC
        `, {
          replacements: { attemptId: latestAttempt.id },
          type: sequelize.QueryTypes.SELECT
        });

        // Combine scores with category names and levels
        interviewLevelEvaluation = interviewLevelScores.map(score => {
          const category = evaluationCategories.find(c => c.evaluation_category.id === score.evaluation_category_id);
          const formattedFeedback = formatFeedback(score.feedback);

          return {
            evaluationCategoryId: score.evaluation_category_id,
            evaluationCategoryName: category ? category.evaluation_category.name : 'Unknown Category',
            score: parseFloat(score.score),
            feedback: formattedFeedback
          };
        });

        // Fetch question-level scores for the completed interview
        // Fetch question-level scores and calculate the total score
        const questionLevelScores = await sequelize.query(`
          SELECT DISTINCT ON ("interview_response_id", "evaluation_category_id")
            "interview_response_id", "evaluation_category_id", "score", "feedback", "createdAt"
          FROM "JobInterviewQuestionLevelAssessments"
          WHERE "user_client_job_interview_attempt_id" = :attemptId
          ORDER BY "interview_response_id", "evaluation_category_id", "createdAt" DESC
        `, {
          replacements: { attemptId: latestAttempt.id },
          type: sequelize.QueryTypes.SELECT
        });


        // Fetch the total score for question-level assessments
        const totalScoreRecord = await JobInterviewQuestionLevelAssessmentTotalScore.findOne({
          where: {
            user_client_job_interview_attempt_id: latestAttempt.id,
          },
          attributes: ['total_score'],
          order: [['createdAt', 'DESC']]
        });

        // Combine scores with category names, question texts, and transcripts
        questionLevelEvaluation = questionLevelScores.map(score => {
          const response = interviewResponses.find(r => r.id === score.interview_response_id);
          const category = evaluationCategories.find(c => c.evaluation_category.id === score.evaluation_category_id);
          const formattedFeedback = formatFeedback(score.feedback);

          return {
            questionOrder: response?.interview_question?.question_order || 'Unknown Order',
            questionText: response?.interview_question?.question?.question_text || 'Unknown Question',
            userResponse: response?.answer_transcription?.transcript || 'No transcript available',
            evaluationCategoryId: score.evaluation_category_id,
            evaluationCategoryName: category ? category.evaluation_category.name : 'Unknown Category',
            score: score.score,
            feedback: formattedFeedback
          };
        });

        // Include the total score in the question-level evaluation
        if (totalScoreRecord) {
          questionLevelEvaluation.push({
            evaluationCategoryName: 'Total Score',
            score: totalScoreRecord.total_score,
          });
        }

      } else {
        status = "User has not completed this interview";
      }

      return {
        clientJobInterviewId: clientJobInterviewId,
        interviewName: interviewName,
        interviewOrder: interviewOrder,
        status: status,
        evaluationResults: {
          interviewLevel: status === "User has completed this interview" ? interviewLevelEvaluation : [],
          questionLevel: status === "User has completed this interview" ? questionLevelEvaluation : []
        },
        interviewResponseDetails
      };
    }));

    // Return the detailed interview statuses
    res.json({ userId, clientJobId, interviews: interviewDetails });
  } catch (error) {
    console.error('Error fetching job interview scores for user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const getAllJobInterviewScoresForUser = async (req, res) => {
  try {
    const { userId, clientJobId } = req.params;

    // Step 1: Find All Interviews Linked to the Job
    const interviews = await ClientJobInterview.findAll({
      where: { job_id: clientJobId },
      include: [
        {
          model: Interview,
          as: 'interview',
          attributes: ['id', 'interview_name']
        }
      ],
      attributes: ['id', 'interview_order']
    });

    if (!interviews.length) {
      return res.status(404).json({ message: 'No interviews found for this job' });
    }

    const interviewDetails = await Promise.all(interviews.map(async (interview) => {
      const clientJobInterviewId = interview.id;
      const interviewName = interview.interview.interview_name;
      const interviewOrder = interview.interview_order;

      // Step 2: Find ALL Attempts for the Interview (No filter for completion)
      const allAttempts = await UserClientJobInterviewAttempt.findAll({
        where: { user_id: userId, client_job_interview_id: clientJobInterviewId },
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: VideoUpload,
            as: 'videoUpload',
            attributes: ['file_url'], // Include video URL
          }
        ]
      });

      const attemptDetails = await Promise.all(allAttempts.map(async (attempt) => {
        let status = attempt.interview_completed ? "Completed" : "Incomplete";
        let questionSetAttempted = attempt.question_set_attempted;
        let interviewLevelEvaluation = [];
        let questionLevelEvaluation = [];
        let interviewResponseDetails = [];
        let questionLevelSummary = null;

        // Fetch evaluation categories
        const evaluationCategories = await InterviewEvaluationCriteria.findAll({
          where: { client_job_interview_id: clientJobInterviewId },
          include: [
            {
              model: JobInterviewEvaluationCategory,
              as: 'evaluation_category',
              attributes: ['id', 'name', 'evaluation_level']
            }
          ]
        });

        // Fetch responses for the attempt
        const interviewResponses = await InterviewResponse.findAll({
          where: { user_client_job_interview_attempt_id: attempt.id },
          attributes: ['id', 'interview_question_id', 'answer_transcription_id'],
          include: [
            {
              model: AnswerTranscript,
              as: 'answer_transcription',
              attributes: ['transcript'],
              include: [
                {
                  model: AnswerAudioUpload,
                  as: 'answer_audio_upload',
                  attributes: ['file_url'] // Include file_url here
                }
              ]
            },
            {
              model: InterviewQuestion,
              as: 'interview_question',
              attributes: ['question_order'],
              include: [
                {
                  model: Question,
                  as: 'question',
                  attributes: ['question_text']
                }
              ]
            }
          ]
        });

        // Populate interview-response-details
        interviewResponseDetails = interviewResponses.map((response) => {
          return {
            questionOrder: response?.interview_question?.question_order || 'Unknown Order',
            questionText: response?.interview_question?.question?.question_text || 'Unknown Question',
            userResponse: response?.answer_transcription?.transcript || 'No transcript available',
            audioUrl: response?.answer_transcription?.answer_audio_upload?.file_url || null
          };
        });

        // Fetch interview-level scores
        const interviewLevelScores = await sequelize.query(`
          SELECT DISTINCT ON ("evaluation_category_id") "evaluation_category_id", "score", "feedback", "createdAt"
          FROM "JobInterviewLevelAssessments"
          WHERE "user_client_job_interview_attempt_id" = :attemptId
          ORDER BY "evaluation_category_id", "createdAt" DESC
        `, {
          replacements: { attemptId: attempt.id },
          type: sequelize.QueryTypes.SELECT
        });

        interviewLevelEvaluation = interviewLevelScores.map(score => {
          const category = evaluationCategories.find(c => c.evaluation_category.id === score.evaluation_category_id);
          const formattedFeedback = formatFeedback(score.feedback);

          return {
            evaluationCategoryId: score.evaluation_category_id,
            evaluationCategoryName: category ? category.evaluation_category.name : 'Unknown Category',
            score: parseFloat(score.score),
            feedback: formattedFeedback
          };
        });

        // Fetch question-level scores
        const questionLevelScores = await sequelize.query(`
          SELECT DISTINCT ON ("interview_response_id", "evaluation_category_id")
            "interview_response_id", "evaluation_category_id", "score", "feedback", "createdAt"
          FROM "JobInterviewQuestionLevelAssessments"
          WHERE "user_client_job_interview_attempt_id" = :attemptId
          ORDER BY "interview_response_id", "evaluation_category_id", "createdAt" DESC
        `, {
          replacements: { attemptId: attempt.id },
          type: sequelize.QueryTypes.SELECT
        });

        questionLevelEvaluation = questionLevelScores.map(score => {
          const response = interviewResponses.find(r => r.id === score.interview_response_id);
          const category = evaluationCategories.find(c => c.evaluation_category.id === score.evaluation_category_id);
          const formattedFeedback = formatFeedback(score.feedback);

          return {
            questionOrder: response?.interview_question?.question_order || 'Unknown Order',
            questionText: response?.interview_question?.question?.question_text || 'Unknown Question',
            userResponse: response?.answer_transcription?.transcript || 'No transcript available',
            audioUrl: response?.answer_transcription?.answer_audio_upload?.file_url || null,
            evaluationCategoryId: score.evaluation_category_id,
            evaluationCategoryName: category ? category.evaluation_category.name : 'Unknown Category',
            score: score.score,
            feedback: formattedFeedback
          };
        });

        // Fetch the total score and evaluation category for question-level assessments
        const totalScoreRecord = await JobInterviewQuestionLevelAssessmentTotalScore.findOne({
          where: { user_client_job_interview_attempt_id: attempt.id },
          attributes: ['total_score', 'evaluation_category_id'],
          order: [['createdAt', 'DESC']],
          include: [
            {
              model: JobInterviewEvaluationCategory,
              as: 'evaluation_category',
              attributes: ['id', 'name']
            }
          ]
        });

        // Include the total score in the question-level evaluation
        if (totalScoreRecord) {
          questionLevelSummary = {
            evaluationCategoryId: totalScoreRecord.evaluation_category.id,
            evaluationCategoryName: totalScoreRecord.evaluation_category.name,
            totalScore: totalScoreRecord.total_score
          };
        }

        return {
          attemptId: attempt.id,
          status,
          questionSetAttempted,
          tabSwitchCount: attempt.tab_switch_count,
          videoUrl: attempt.videoUpload?.file_url || null,
          attemptDate: attempt.createdAt,
          interviewLevelEvaluation,
          questionLevelEvaluation,
          questionLevelSummary,
          interviewResponseDetails
          
        };
      }));

      return {
        clientJobInterviewId: clientJobInterviewId,
        interviewName: interviewName,
        interviewOrder: interviewOrder,
        attempts: attemptDetails
      };
    }));

    // Return all interview attempts for the user
    res.json({ userId, clientJobId, interviews: interviewDetails });
  } catch (error) {
    console.error('Error fetching all job interview scores for user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getAllCandidateScoresForJob = async (req, res) => {
  try {
    const { clientJobId } = req.params;

    // Step 1: Find All Interviews Linked to the Job
    const interviews = await ClientJobInterview.findAll({
      where: { job_id: clientJobId },
      attributes: ['id', 'interview_order'],
      include: [{
        model: Interview,
        as: 'interview',
        attributes: ['id', 'interview_name']
      }],
      order: [['interview_order', 'ASC']]
    });

    if (!interviews.length) {
      return res.status(404).json({ message: 'No interviews found for this job' });
    }

    // Step 2: Get evaluation categories for each interview
    let interviewEvaluationCriteriaMap = {};
    for (let interview of interviews) {
      const evaluationCategories = await InterviewEvaluationCriteria.findAll({
        where: { client_job_interview_id: interview.id },
        include: [{
          model: JobInterviewEvaluationCategory,
          as: 'evaluation_category',
          attributes: ['id', 'name', 'evaluation_level']
        }]
      });

      interviewEvaluationCriteriaMap[interview.interview.interview_name] = {
        interviewLevelCategories: evaluationCategories.filter(c => c.evaluation_category.evaluation_level === 'interview'),
        questionLevelCategories: evaluationCategories.filter(c => c.evaluation_category.evaluation_level === 'question'),
      };
    }

    // Step 3: Get all candidates who attempted any of the interviews
    const allAttempts = await UserClientJobInterviewAttempt.findAll({
      where: {
        client_job_interview_id: interviews.map(interview => interview.id)
      },
      attributes: ['user_id', [sequelize.fn('MAX', sequelize.col('UserClientJobInterviewAttempt.createdAt')), 'latest_attempt_date']],
      group: ['user_id', 'user.firstName', 'user.lastName', 'user.id'],
      include: [
        {
          model: Users, // Assuming Users is the model name for your user table
          as: 'user',
          attributes: ['firstName', 'lastName'] // Fetching firstName and lastName
        }
      ]
    });
    // find the userJob model for the users with ids in allAttempts
    const userJobs = await UserJob.findAll({
      where: {
        user_id: allAttempts.map(attempt => attempt.user_id),
        job_id: clientJobId
      }
    });
    // create a map to store the userJob status for each user
    const userJobStatusMap = {};
    userJobs.forEach(userJob => {
      userJobStatusMap[userJob.user_id] = userJob.status;
    });

    // Create a map to store the latest attempt date for each user
    const latestAttemptDates = Array.isArray(allAttempts) ? allAttempts.reduce((map, attempt) => {
      map[attempt.user_id] = attempt.dataValues.latest_attempt_date;
      return map;
    }, {}) : {};
    if (!allAttempts.length) {
      return res.status(404).json({ message: 'No candidates found for this job' });
    }

    // check how many users have completed all the interviews for the job, remember each interview can have multiple attempts, so we need to check if at least one attempt is completed for each interview
    const allCompletedAttempts = await UserClientJobInterviewAttempt.findAll({
      where: {
        client_job_interview_id: interviews.map(interview => interview.id),
        interview_completed: true
      },
      attributes: ['user_id', 'client_job_interview_id'],
      group: ['user_id', 'client_job_interview_id']
    });

    const userInterviewCount = Array.isArray(allCompletedAttempts) ? allCompletedAttempts.reduce((acc, attempt) => {
      acc[attempt.user_id] = (acc[attempt.user_id] || 0) + 1;
      return acc;
    }, {}) : {};

    const completedUsers = Object.keys(userInterviewCount).filter(userId => userInterviewCount[userId] === interviews.length);
    // create a map to store the completed users
    const completedUsersMap = {};
    completedUsers.forEach(userId => {
      completedUsersMap[userId] = true;
    });
    console.log('Completed users: ', completedUsers);

    // Step 4: Prepare the report structure
    let reportData = [];

    for (let attempt of allAttempts) {
      const userId = attempt.user_id;
      const userName = `${attempt.user.firstName} ${attempt.user.lastName}`;
      // if user has completed all interviews , also return latest attempt date otherwise null 
      if (completedUsersMap[userId]) {
        console.log('User has completed all interviews');
      }
      const latest_attempt = completedUsersMap[userId] ? (latestAttemptDates[userId] ? latestAttemptDates[userId] : null) : null;
      let candidateRow = {
        userId,
        userName,
        latest_attempt,
        userJobStatus: userJobStatusMap[userId],
        interviews: {}
      };

      // Step 5: Fetch the latest attempts for each interview for the candidate
      for (let interview of interviews) {
        const interviewName = interview.interview.interview_name;
        const latestCompletedAttempt = await UserClientJobInterviewAttempt.findOne({
          where: {
            user_id: userId,
            client_job_interview_id: interview.id,
            interview_completed: true
          },
          order: [['createdAt', 'DESC']]
        });

        let interviewCriteriaScores = {};

        if (latestCompletedAttempt) {
          // Fetch interview-level scores
          const interviewLevelScores = await sequelize.query(`
            SELECT DISTINCT ON ("evaluation_category_id") "evaluation_category_id", "score", "createdAt"
            FROM "JobInterviewLevelAssessments"
            WHERE "user_client_job_interview_attempt_id" = :attemptId
            ORDER BY "evaluation_category_id", "createdAt" DESC
          `, {
            replacements: { attemptId: latestCompletedAttempt.id },
            type: sequelize.QueryTypes.SELECT
          });

          // Map interview-level scores to their categories
          interviewLevelScores.forEach(score => {
            const category = interviewEvaluationCriteriaMap[interviewName].interviewLevelCategories.find(c => c.evaluation_category.id === score.evaluation_category_id);
            interviewCriteriaScores[category ? category.evaluation_category.name : `Criterion_${score.evaluation_category_id}`] = parseFloat(score.score) || 0;
          });

          // Fetch question-level total scores (fetching only the latest one)
          const totalScoreRecords = await sequelize.query(`
            SELECT DISTINCT ON ("evaluation_category_id") "total_score", "evaluation_category_id", "createdAt"
            FROM "JobInterviewQuestionLevelAssessmentTotalScores"
            WHERE "user_client_job_interview_attempt_id" = :attemptId
            ORDER BY "evaluation_category_id", "createdAt" DESC
          `, {
            replacements: { attemptId: latestCompletedAttempt.id },
            type: sequelize.QueryTypes.SELECT
          });

          // Map question-level total scores to their categories
          totalScoreRecords.forEach(score => {
            const category = interviewEvaluationCriteriaMap[interviewName].questionLevelCategories.find(c => c.evaluation_category.id === score.evaluation_category_id);
            interviewCriteriaScores[category ? `${category.evaluation_category.name} (Total Score)` : `TotalScore_${score.evaluation_category_id}`] = parseFloat(score.total_score) || 0;
          });
        }

        // If no scores exist, set a default message
        if (Object.keys(interviewCriteriaScores).length === 0) {
          interviewEvaluationCriteriaMap[interviewName].interviewLevelCategories.forEach(category => {
            interviewCriteriaScores[category.evaluation_category.name] = 0;
          });
          interviewEvaluationCriteriaMap[interviewName].questionLevelCategories.forEach(category => {
            interviewCriteriaScores[`${category.evaluation_category.name} (Total Score)`] = 0;
          });
        }

        // Add the scores to the candidate's interview data
        candidateRow.interviews[interviewName] = interviewCriteriaScores;
      }

      // Push the candidate's data into the report
      reportData.push(candidateRow);
    }

    // Step 6: Return the structured report data
    res.json({
      clientJobId,
      report: reportData
    });
  } catch (error) {
    console.error('Error generating candidate score report:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// to return a presigned url for a file_url
const getPresignedUrl = async (req, res) => {
  try {
    const { bucketName, fileKey } = req.body;
    if (!bucketName || !fileKey) {
      return res.status(400).json({ message: 'bucketName and fileKey are required' });
    }
    console.log("Bucket name", bucketName); // Debugging log
    console.log("Filekey", fileKey); // Debugging log
    const presignedUrl = await generatePresignedUrl(bucketName, fileKey);
    console.log("Generated Pre-Signed URL:", presignedUrl); // Debugging log
    return res.status(200).json({ presignedUrl });
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    return res.status(500).json({ message: 'Error generating presigned URL' });
  }
};
module.exports = {
  scoreInterview,
  getJobInterviewScoresForUser,
  getAllJobInterviewScoresForUser,
  getAllCandidateScoresForJob,
  getPresignedUrl
};