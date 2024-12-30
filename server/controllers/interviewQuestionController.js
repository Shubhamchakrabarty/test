// controllers/interviewQuestionController.js

const { InterviewQuestion } = require('../models');

const linkQuestionToInterview = async (req, res) => {
  const { interview_id, question_id, question_order, question_set } = req.body;
  console.log(`Received request to link question to interview: ${JSON.stringify(req.body)}`);

  try {
    const newLink = await InterviewQuestion.create({
      interview_id,
      question_id,
      question_order,
      question_set
    });

    console.log(`Question linked to interview: ${JSON.stringify(newLink)}`);
    res.status(201).json(newLink);
  } catch (error) {
    console.error('Error linking question to interview:', error.message || error);
    res.status(500).json({ message: 'Error linking question to interview' });
  }
};

module.exports = {
  linkQuestionToInterview,
};
