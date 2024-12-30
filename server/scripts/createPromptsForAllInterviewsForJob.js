// createPromptsForAllInterviewsForJob.js

const { JobInterviewPrompt, sequelize } = require('../models'); // Assuming models are in a ./models directory
const { jobPromptTemplate } = require('../templates/jobPromptTemplate'); // Import the prompt template file
require('dotenv').config();

(async () => {
  const transaction = await sequelize.transaction();

  try {
    console.log('Starting the prompt insertion script...');

    for (const prompt of jobPromptTemplate.prompts) {
      const { client_job_interview_id, evaluation_category_id, prompt_text, scoring_criteria } = prompt;

      // Create the JobInterviewPrompt entry
      const newPrompt = await JobInterviewPrompt.create({
        client_job_interview_id,
        evaluation_category_id,
        prompt_text,
        scoring_criteria,
      }, { transaction });

      console.log(`Prompt created for interview ${client_job_interview_id} with evaluation category ${evaluation_category_id}: ${newPrompt.id}`);
    }

    // Commit transaction if everything works
    await transaction.commit();
    console.log('All prompts inserted successfully!');
    
  } catch (error) {
    console.error('Error during prompt insertion:', error.message, error.stack);
    await transaction.rollback();
  }
})();
