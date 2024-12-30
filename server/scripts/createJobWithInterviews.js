// createJobWithInterviews.js

const { ClientJob, Interview, ClientJobInterview, ClientUser, Client, Question, InterviewQuestion, InterviewEvaluationCriteria, ReferenceAnswer, InterviewInstructions, sequelize } = require('../models'); // Assuming models are in a ./models directory
const { jobInterviewTemplate } = require('../templates/jobInterviewTemplate'); // Assuming template file is created separately
require('dotenv').config();

console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DB_NAME:', process.env.DB_NAME_PROD);

(async () => {
  const transaction = await sequelize.transaction();

  try {
    const isProduction = process.env.NODE_ENV === 'production';
    console.log(`Running script in ${isProduction ? 'production' : 'development'} mode`);

    // Step 1: Retrieve Client Information from ClientUser
    const { client_user_id, job_title, job_description, status } = jobInterviewTemplate.ClientJob;

    const clientUser = await ClientUser.findOne({ where: { id: client_user_id }, include: [{ model: Client, as: 'client' }] });

    if (!clientUser) {
      throw new Error(`Client User with id ${client_user_id} not found.`);
    }

    //const clientId = clientUser.client_id;

    // Job title uniqueness check removed based on early-stage testing decision

    // Create the new job if no conflict is found
    const clientJob = await ClientJob.create({
      client_user_id,
      job_title,
      job_description,
      status
    }, { transaction });

    console.log(`Client Job created: ${clientJob.id}`);

    // Store the job ID for linking
    const jobId = clientJob.id;

    // Step 2: Create Interviews for the Job
    for (const [index, interviewData] of jobInterviewTemplate.Interviews.entries()) {
      const { interview_name, interview_time_limit, time_limit_per_answer, status, Questions, EvaluationCriteria, pre_interview_instructions } = interviewData;

      const interview = await Interview.create({
        client_user_id,
        interview_name,
        interview_time_limit,
        time_limit_per_answer,
        status
      }, { transaction });

      console.log(`Interview created: ${interview.id}`);

      // Store interview ID for linking later
      const interviewId = interview.id;

      // Step 3: Link Interviews to ClientJob with dynamic interview order
      const clientJobInterview= await ClientJobInterview.create({
        job_id: jobId,
        interview_id: interviewId,
        interview_order: index + 1 // Dynamically set interview order based on position in the array
      }, { transaction });

      console.log(`Interview linked to Job: ${jobId} -> ${interviewId} (Order: ${index + 1})`);

      // Step 4: Handle Pre-Interview Instructions (optional)
      if (pre_interview_instructions) {
        const { pre_interview_instructions: instructions, welcome_message, welcome_video_url, context_video_url, context_video_text, language = "en-IN", interview_response_type = "audio" } = pre_interview_instructions;

        await InterviewInstructions.create({
          interview_id: interviewId,
          pre_interview_instructions: instructions,
          welcome_message,
          welcome_video_url,
          context_video_url,
          context_video_text,
          language,
          interview_response_type
        }, { transaction });

        console.log(`Pre-interview instructions created for Interview: ${interviewId}`);
      }

      // Step 5: Create Questions and reference answers for the Interview
      for (const questionData of Questions) {
        const { question_text, question_type, media_url, text_instructions, question_order, reference_answers } = questionData;

        const question = await Question.create({
          client_user_id,
          question_text,
          question_type,
          media_url,
          text_instructions
        }, { transaction });

        console.log(`Question created: ${question.id}`);

        // Link Questions to the Interview with specified question_order
        const interviewQuestion = await InterviewQuestion.create({
          interview_id: interviewId,
          question_id: question.id,
          question_order // Use the question_order from the template file
        }, { transaction });

        console.log(`Question linked to Interview: ${interviewId} -> ${question.id} (Order: ${question_order})`);
        // Handle Reference Answers (Optional)
        if (reference_answers) {
            for (const refAnswer of reference_answers) {
            const { evaluation_category_id, answers } = refAnswer;
            for (const answer of answers) {
                await ReferenceAnswer.create({
                interview_question_id: interviewQuestion.id,
                evaluation_category_id,
                score: answer.score,
                answer: answer.answer
                }, { transaction });
            }
            }
            console.log(`Reference answers added for question ${interviewQuestion.id}`);
        }

      }

      

      // Step 6: Handle Interview-Level Evaluation Criteria
      if (EvaluationCriteria) {
        for (const criteria of EvaluationCriteria) {
          const { evaluation_category_id, priority, instructions } = criteria;

          await InterviewEvaluationCriteria.create({
            client_job_interview_id: clientJobInterview.id,
            evaluation_category_id,
            priority,
            instructions
          }, { transaction });

          console.log(`Evaluation Criteria created for Client Job Interview Id: ${clientJobInterview.id}`);
        }
      }
    }

    // Commit transaction if everything works
    await transaction.commit();
    console.log('Job, interviews, questions, and evaluation criteria created successfully!');
    
  } catch (error) {
    console.error('Error during job, interview, question, or evaluation criteria creation:', error.message, error.stack);
    await transaction.rollback();
  }
})();
