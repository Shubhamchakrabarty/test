// controllers/questionController.js

const { Question } = require('../models');

const createQuestion = async (req, res) => {
  const { client_user_id, question_text, question_type, media_url, text_instructions } = req.body;
  console.log(`Received request to create question: ${JSON.stringify(req.body)}`);

  try {
    const newQuestion = await Question.create({
      client_user_id,
      question_text,
      question_type,
      media_url,
      text_instructions,
    });

    console.log(`New question created: ${JSON.stringify(newQuestion)}`);
    res.status(201).json(newQuestion);
  } catch (error) {
    console.error('Error creating question:', error.message || error);
    res.status(500).json({ message: 'Error creating question' });
  }
};

// Read a question by ID
const getQuestionById = async (req, res) => {
  const { id } = req.params;
  
  try {
    const question = await Question.findByPk(id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.status(200).json(question);
  } catch (error) {
    console.error('Error fetching question:', error.message || error);
    res.status(500).json({ message: 'Error fetching question' });
  }
};

// Update a question by ID
const updateQuestion = async (req, res) => {
  const { id } = req.params;
  const { question_text, question_type, media_url, text_instructions } = req.body;

  try {
    const question = await Question.findByPk(id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    question.question_text = question_text || question.question_text;
    question.question_type = question_type || question.question_type;
    question.media_url = media_url || question.media_url;
    question.text_instructions = text_instructions || question.text_instructions;

    await question.save();

    res.status(200).json(question);
  } catch (error) {
    console.error('Error updating question:', error.message || error);
    res.status(500).json({ message: 'Error updating question' });
  }
};

// Delete a question by ID
const deleteQuestion = async (req, res) => {
  const { id } = req.params;

  try {
    const question = await Question.findByPk(id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    await question.destroy();

    res.status(204).json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error('Error deleting question:', error.message || error);
    res.status(500).json({ message: 'Error deleting question' });
  }
};

module.exports = {
  createQuestion,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
};
