const { HrInterviewResponse, Interview, InterviewQuestion, Question, ClientJobInterview, ClientJob, InterviewInstructions, UserClientJobInterviewAttempt } = require('../models');

const createInterview = async (req, res) => {
  const { client_user_id, interview_name, interview_time_limit, time_limit_per_answer, status } = req.body;
  console.log(`Received request to create interview: ${JSON.stringify(req.body)}`);

  try {
    const newInterview = await Interview.create({
      client_user_id,
      interview_name,
      interview_time_limit,
      time_limit_per_answer,
      status,
    });

    console.log(`New interview created: ${JSON.stringify(newInterview)}`);
    res.status(201).json(newInterview);
  } catch (error) {
    console.error('Error creating interview:', error.message || error);
    res.status(500).json({ message: 'Error creating interview' });
  }
};

const getAllInterviews = async (req, res) => {
  try {
    const interviews = await Interview.findAll();
    console.log(`Fetched all interviews: ${JSON.stringify(interviews)}`);
    res.status(200).json(interviews);
  } catch (error) {
    console.error('Error fetching interviews:', error.message || error);
    res.status(500).json({ message: 'Error fetching interviews' });
  }
};

const getInterviewById = async (req, res) => {
  const { id } = req.params;

  try {
    const interview = await Interview.findByPk(id);

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    console.log(`Fetched interview with ID ${id}: ${JSON.stringify(interview)}`);
    res.status(200).json(interview);
  } catch (error) {
    console.error('Error fetching interview:', error.message || error);
    res.status(500).json({ message: 'Error fetching interview' });
  }
};

const updateInterview = async (req, res) => {
  const { id } = req.params;
  const { interview_name, interview_time_limit, time_limit_per_answer, status } = req.body;

  try {
    const interview = await Interview.findByPk(id);

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    interview.interview_name = interview_name;
    interview.interview_time_limit = interview_time_limit;
    interview.time_limit_per_answer = time_limit_per_answer;
    interview.status = status;

    await interview.save();

    console.log(`Updated interview with ID ${id}: ${JSON.stringify(interview)}`);
    res.status(200).json(interview);
  } catch (error) {
    console.error('Error updating interview:', error.message || error);
    res.status(500).json({ message: 'Error updating interview' });
  }
};

const deleteInterview = async (req, res) => {
  const { id } = req.params;

  try {
    const interview = await Interview.findByPk(id);

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    await interview.destroy();

    console.log(`Deleted interview with ID ${id}`);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting interview:', error.message || error);
    res.status(500).json({ message: 'Error deleting interview' });
  }
};

const getQuestionsForInterview = async (req, res) => {
  const { interview_id } = req.params;
  console.log(`Fetching questions for interview ID: ${interview_id}`);

  try {
    const questions = await InterviewQuestion.findAll({
      where: { interview_id },
      include: [
        {
          model: Question,
          as: 'question',
          attributes: ['id', 'question_text', 'question_type', 'media_url', 'text_instructions'],
        },
      ],
    });

    if (!questions.length) {
      return res.status(404).json({ message: 'No questions found for this interview.' });
    }

    res.status(200).json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error.message || error);
    res.status(500).json({ message: 'Error fetching questions for the interview.' });
  }
};

const getQuestionsForClientJobInterview = async (req, res) => {
  const { client_job_interview_id } = req.params;
  console.log(`Fetching questions for client_job_interview_id: ${client_job_interview_id}`);

  try {
    // Find the associated interview_id
    const clientJobInterview = await ClientJobInterview.findByPk(client_job_interview_id, {
      include: [{
        model: Interview,
        as: 'interview',
        attributes: ['id', 'interview_name']
      }]
    });

    if (!clientJobInterview) {
      return res.status(404).json({ message: 'Client Job Interview not found.' });
    }

    const interview_id = clientJobInterview.interview.id;

    // Fetch questions for the interview_id
    const questions = await InterviewQuestion.findAll({
      where: { interview_id },
      include: [
        {
          model: Question,
          as: 'question',
          attributes: ['id', 'question_text', 'question_type', 'media_url', 'text_instructions'],
        },
      ],
    });

    if (!questions.length) {
      return res.status(404).json({ message: 'No questions found for this interview.' });
    }

    res.status(200).json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error.message || error);
    res.status(500).json({ message: 'Error fetching questions for the client job interview.' });
  }
};

const getClientJobInterviewDetails = async (req, res) => {
  const { client_job_interview_id } = req.params;
  const { userId } = req.query;
  
  try {
    let questionSetToSelect = 1;
    let numberOfQuestionSets = 1;

    if(userId) {
      const jobInterview = await ClientJobInterview.findByPk(client_job_interview_id);
      if (!jobInterview) {
        return res.status(404).json({ message: 'Client Job Interview not found.' });
      }

      numberOfQuestionSets = jobInterview.number_of_question_sets;

      if(jobInterview.question_set_selection_method === 'fixed') {
        questionSetToSelect = jobInterview.question_set_fixed;
      } else {
        const userClientJobInterviewAttempts = await UserClientJobInterviewAttempt.findAll({
          where: {
            client_job_interview_id: client_job_interview_id,
            user_id: userId
          }
        });
        
        const usedOptions = userClientJobInterviewAttempts.map(attempt => attempt.question_set_attempted);
        const allOptions = new Array(numberOfQuestionSets);
        for(let idx = 0; idx < numberOfQuestionSets; idx++) allOptions[idx] = idx + 1;
        const unusedOptions = allOptions.filter(option => !usedOptions.includes(option));

        if(unusedOptions.length === 0) {
          // every set has been attempted atleast once
          questionSetToSelect = allOptions[Math.floor(Math.random() * allOptions.length)];
        } else {
          // some sets remain unattempted
          questionSetToSelect = unusedOptions[Math.floor(Math.random() * unusedOptions.length)];
        }

      }
    }

    console.log(questionSetToSelect, numberOfQuestionSets, userId);

    // Fetch the ClientJobInterview details, including the associated Interview and ClientJob
    const clientJobInterview = await ClientJobInterview.findByPk(client_job_interview_id, {
      include: [
        {
          model: Interview,
          as: 'interview',
          attributes: ['id', 'interview_name', 'interview_time_limit', 'time_limit_per_answer', 'status'],
          include: [
            {
              model: InterviewQuestion,
              as: 'interview_questions',
              where: userId ? { question_set: questionSetToSelect } : undefined,
              include: [
                {
                  model: Question,
                  as: 'question',
                  attributes: ['id', 'question_text', 'question_type', 'media_url', 'text_instructions'],
                },
              ],
            },
            {
              model: InterviewInstructions,
              as: 'instructions',
              attributes: ['pre_interview_instructions', 'welcome_message', 'welcome_video_url', 'context_video_url', 'context_video_text', 'language', 'interview_response_type'],
            },
          ],
        },
        {
          model: ClientJob,
          as: 'clientjob',
          attributes: ['id', 'job_title', 'job_description', 'status'],
        },
      ],
    });

    if (!clientJobInterview) {
      return res.status(404).json({ message: 'Client Job Interview not found.' });
    }

    if (userId) {
      // If userId exists, send both interviewData and questionSetSelected
      res.status(200).json({ interviewData: clientJobInterview, questionSetSelected: questionSetToSelect });
    } else {
      // If userId does not exist, send only interviewData
      res.status(200).json({ interviewData: clientJobInterview });
    }

  } catch (error) {
    console.error('Error fetching client job interview details:', error.message || error);
    res.status(500).json({ message: 'Error fetching client job interview details.' });
  }
};


const checkInterviewCompletion = async (req, res) => {
    try {
      const { email } = req.params;
      if (!email) {
        return res.status(400).json({ message: 'Email is required' });
      }
  
      const response = await HrInterviewResponse.findOne({
        where: { email },
      });
  
      if (response) {
        res.status(200).json({ completed: true });
      } else {
        res.status(404).json({ message: 'No interview response found for the user' });
      }
    } catch (error) {
      console.error('Error checking interview completion:', error);
      res.status(500).json({ message: 'Error checking interview completion' });
    }
  };

const getUniqueFormTitles = async (req, res) => {
    try {
      const userId = req.params.userId;
      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }
  
      const responses = await HrInterviewResponse.findAll({
        where: { userId },
        attributes: ['formTitle'],
        group: ['formTitle'],
      });
  
      if (!responses || responses.length === 0) {
        return res.status(404).json({ message: 'No interview responses found for the user' });
      }
  
      const uniqueFormTitles = responses.map(response => response.formTitle);
      res.status(200).json({ formTitles: uniqueFormTitles });
    } catch (error) {
      console.error('Error fetching unique form titles:', error);
      res.status(500).json({ message: 'Error fetching unique form titles' });
    }
  };




// Create new interview instructions
const createInterviewInstructions = async (req, res) => {
  const { interview_id } = req.params;
  const { pre_interview_instructions, welcome_message, welcome_video_url, context_video_url, context_video_text, language,  interview_response_type} = req.body;
  // Optional validation
  if (!pre_interview_instructions && !welcome_message && !welcome_video_url && !context_video_url && !context_video_text && !language && !interview_response_type) {
    return res.status(400).json({ error: 'At least one instruction field must be provided.' });
  }
  try {
      const newInstructions = await InterviewInstructions.create({
          interview_id,
          pre_interview_instructions,
          welcome_message,
          welcome_video_url,
          context_video_url,
          context_video_text,
          language: language || 'en-IN',
          interview_response_type: interview_response_type || 'audio'
      });
      return res.status(201).json(newInstructions);
  } catch (error) {
      console.error('Error creating interview instructions:', error.message, error.stack); // Log the error
      return res.status(500).json({ error: 'Failed to create interview instructions' });
  }
};

// Get interview instructions by ID
const getInterviewInstructionsById = async (req, res) => {
  const { id } = req.params;
  try {
      const instructions = await InterviewInstructions.findByPk(id);
      if (!instructions) {
          return res.status(404).json({ error: 'Instructions not found' });
      }
      return res.status(200).json(instructions);
  } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch interview instructions' });
  }
};

// Update interview instructions
const updateInterviewInstructions = async (req, res) => {
  const { id } = req.params;
  const { pre_interview_instructions, welcome_message, welcome_video_url, context_video_url, context_video_text, language, interview_response_type } = req.body;
  if (!pre_interview_instructions && !welcome_message && !welcome_video_url && !context_video_url && !context_video_text && !language && !interview_response_type) {
    return res.status(400).json({ error: 'At least one instruction field must be provided.' });
  }
  try {
      const instructions = await InterviewInstructions.findByPk(id);
      if (!instructions) {
          return res.status(404).json({ error: 'Instructions not found' });
      }

      await instructions.update({
          pre_interview_instructions,
          welcome_message,
          welcome_video_url,
          context_video_url,
          context_video_text,
          language: language || instructions.language,
          interview_response_type: interview_response_type || instructions.interview_response_type
      });
      return res.status(200).json(instructions);
  } catch (error) {
      return res.status(500).json({ error: 'Failed to update interview instructions' });
  }
};

// Delete interview instructions
const deleteInterviewInstructions = async (req, res) => {
  const { id } = req.params;
  try {
      const instructions = await InterviewInstructions.findByPk(id);
      if (!instructions) {
          return res.status(404).json({ error: 'Instructions not found' });
      }

      await instructions.destroy();
      return res.status(200).json({ message: 'Interview instructions deleted successfully' });
  } catch (error) {
      return res.status(500).json({ error: 'Failed to delete interview instructions' });
  }
};

// Get instructions for a specific interview
const getInterviewInstructionsByInterviewId = async (req, res) => {
  const { interviewId } = req.params;
  
  try {
      const instructions = await InterviewInstructions.findOne({
          where: { interview_id: interviewId }
      });
      
      if (!instructions) {
          return res.status(404).json({ error: 'Interview instructions not found' });
      }
      
      return res.status(200).json(instructions);
  } catch (error) {
      return res.status(500).json({ error: 'Failed to retrieve interview instructions' });
  }
};

module.exports = { 
  checkInterviewCompletion,
  getUniqueFormTitles,
  createInterview,
  getAllInterviews,
  getInterviewById,
  updateInterview,
  deleteInterview,
  getQuestionsForInterview,
  getQuestionsForClientJobInterview,
  getClientJobInterviewDetails,
  createInterviewInstructions,
  getInterviewInstructionsById,
  updateInterviewInstructions,
  deleteInterviewInstructions,
  getInterviewInstructionsByInterviewId 
};