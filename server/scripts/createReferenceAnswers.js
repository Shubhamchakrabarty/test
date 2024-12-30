const axios = require('axios');
const { referenceAnswersTemplate } = require('../referenceExamplesForPrompts/referenceAnswersTemplate');
//console.log(referenceAnswersTemplate);

// Base URLs for dev and prod
const baseURLDev = 'http://localhost:5000';
const baseURLProd = 'https://pehchaan.me';

// Function to send POST request for each reference answer
const sendPostReferenceAnswer = async (baseURL, answerData) => {
  try {
    const response = await axios.post(`${baseURL}/api/job-interview-prompts/reference-answers`, answerData);
    console.log(`POST: Reference Answer for interview_question_id ${answerData.interview_question_id} sent successfully to ${baseURL}`);
  } catch (error) {
    console.error(`Error with POST to ${baseURL}:`, error.message);
  }
};

// Function to handle POST for all reference answers
const handleReferenceAnswers = async (baseURL) => {
  const refAnswers = referenceAnswersTemplate.RefAnswers;
  //console.log(refAnswers)
   
  for (const refAnswer of refAnswers) {
    const { interview_question_id, evaluation_category_id, answers } = refAnswer;

    for (const answerObj of answers) {
      const { score, answer } = answerObj;
      const answerData = {
        interview_question_id,
        evaluation_category_id,
        score,
        answer,
      };

      await sendPostReferenceAnswer(baseURL, answerData);
    }
  }

  console.log('All reference answers processed.');
  
};

// Command line argument to switch between dev/prod
const environment = process.argv[2]; // 'dev' or 'prod'

// Function to execute the POST API calls
const executeReferenceAnswerApiCall = async () => {
  const baseURL = environment === 'dev' ? baseURLDev : baseURLProd;
  await handleReferenceAnswers(baseURL);
};

// Execute the function
executeReferenceAnswerApiCall();
