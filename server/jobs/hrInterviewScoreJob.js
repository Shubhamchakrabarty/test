const Queue = require('bull');
const { calculateInterviewScore } = require('../services/interviewScoringService');
const { saveInterviewScore } = require('../services/saveData');
const { HrInterviewResponse, Users } = require('../models');

const hrInterviewScoreQueue = new Queue('hrInterviewScoreQueue', {
  redis: { port: 6379, host: '127.0.0.1' }
});

hrInterviewScoreQueue.process(async (job) => {
  const { email, formTitles } = job.data;
  console.log("Scoring HR interviews for Email:", email, "Form Titles:", formTitles);

  try {
    const user = await Users.findOne({ where: { email } });
    if (!user) {
      throw new Error('No user found with email: ' + email);
    }

    for (const formTitle of formTitles) {
      const latestResponse = await HrInterviewResponse.findOne({
        where: { email, formTitle },
        attributes: ['id', 'name', 'email', 'formTitle', 'formId', 'response', 'createdAt'],
        order: [['createdAt', 'DESC']],
      });

      if (!latestResponse) {
        console.log(`No HR interview response found for email: ${email} and form title: ${formTitle}`);
        continue;
      }

      const interviewData = latestResponse.response;

      const scores = await calculateInterviewScore(formTitle, interviewData);

      await saveInterviewScore(user.id, latestResponse.id, formTitle, scores);

      console.log(`HR interview scoring complete for email: ${email} and form title: ${formTitle}`);
    }

    return true;
  } catch (error) {
    console.error('Error scoring HR interview:', error);
    throw error;
  }
});

module.exports = hrInterviewScoreQueue;