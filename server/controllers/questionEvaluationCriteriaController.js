// controllers/questionEvaluationCriteriaController.js
const { QuestionEvaluationCriteria } = require('../models');

// Create a new Question Evaluation Criteria
exports.createQuestionEvaluationCriteria = async (req, res) => {
  try {
    const { interview_question_id, evaluation_category_id, priority=1, instructions } = req.body;
    const questionEvaluationCriteria = await QuestionEvaluationCriteria.create({
      interview_question_id,
      evaluation_category_id,
      priority,
      instructions,
    });
    res.status(201).json(questionEvaluationCriteria);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create question evaluation criteria' });
  }
};

// Get all Question Evaluation Criteria for a specific question
exports.getQuestionEvaluationCriteria = async (req, res) => {
  try {
    const { interview_question_id } = req.params;
    const criteria = await QuestionEvaluationCriteria.findAll({ where: { interview_question_id } });
    res.status(200).json(criteria);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve question evaluation criteria' });
  }
};

// Update a Question Evaluation Criteria by ID
exports.updateQuestionEvaluationCriteria = async (req, res) => {
  try {
    const { id } = req.params;
    const { priority=1, instructions } = req.body;
    const questionEvaluationCriteria = await QuestionEvaluationCriteria.findByPk(id);
    if (!questionEvaluationCriteria) {
      return res.status(404).json({ error: 'Question evaluation criteria not found' });
    }
    questionEvaluationCriteria.priority = priority;
    questionEvaluationCriteria.instructions = instructions;
    await questionEvaluationCriteria.save();
    res.status(200).json(questionEvaluationCriteria);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update question evaluation criteria' });
  }
};

// Delete a Question Evaluation Criteria by ID
exports.deleteQuestionEvaluationCriteria = async (req, res) => {
  try {
    const { id } = req.params;
    const questionEvaluationCriteria = await QuestionEvaluationCriteria.findByPk(id);
    if (!questionEvaluationCriteria) {
      return res.status(404).json({ error: 'Question evaluation criteria not found' });
    }
    await questionEvaluationCriteria.destroy();
    res.status(204).json({ message: 'Question evaluation criteria deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete question evaluation criteria' });
  }
};
