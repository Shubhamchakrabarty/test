// controllers/interviewEvaluationCriteriaController.js
const { InterviewEvaluationCriteria } = require('../models');

// Create a new Interview Evaluation Criteria
exports.createInterviewEvaluationCriteria = async (req, res) => {
  try {
    const { client_job_interview_id, evaluation_category_id, priority=1, instructions } = req.body;
    const interviewEvaluationCriteria = await InterviewEvaluationCriteria.create({
      client_job_interview_id,
      evaluation_category_id,
      priority,
      instructions,
    });
    res.status(201).json(interviewEvaluationCriteria);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create interview evaluation criteria' });
  }
};

// Get all Interview Evaluation Criteria for a specific interview
exports.getInterviewEvaluationCriteria = async (req, res) => {
  try {
    const { client_job_interview_id } = req.params;
    const criteria = await InterviewEvaluationCriteria.findAll({ where: { client_job_interview_id } });
    res.status(200).json(criteria);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve interview evaluation criteria' });
  }
};

// Update an Interview Evaluation Criteria by ID
exports.updateInterviewEvaluationCriteria = async (req, res) => {
  try {
    const { id } = req.params;
    const { priority=1, instructions } = req.body;
    const interviewEvaluationCriteria = await InterviewEvaluationCriteria.findByPk(id);
    if (!interviewEvaluationCriteria) {
      return res.status(404).json({ error: 'Interview evaluation criteria not found' });
    }
    interviewEvaluationCriteria.priority = priority;
    interviewEvaluationCriteria.instructions = instructions;
    await interviewEvaluationCriteria.save();
    res.status(200).json(interviewEvaluationCriteria);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update interview evaluation criteria' });
  }
};

// Delete an Interview Evaluation Criteria by ID
exports.deleteInterviewEvaluationCriteria = async (req, res) => {
  try {
    const { id } = req.params;
    const interviewEvaluationCriteria = await InterviewEvaluationCriteria.findByPk(id);
    if (!interviewEvaluationCriteria) {
      return res.status(404).json({ error: 'Interview evaluation criteria not found' });
    }
    await interviewEvaluationCriteria.destroy();
    res.status(204).json({ message: 'Interview evaluation criteria deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete interview evaluation criteria' });
  }
};
