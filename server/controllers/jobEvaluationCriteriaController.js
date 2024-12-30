// controllers/jobEvaluationCriteriaController.js
const { JobEvaluationCriteria } = require('../models');

// Create a new Job Evaluation Criteria
exports.createJobEvaluationCriteria = async (req, res) => {
  try {
    const { job_id, evaluation_category_id, priority = 1, instructions } = req.body;
    const jobEvaluationCriteria = await JobEvaluationCriteria.create({
      job_id,
      evaluation_category_id,
      priority,
      instructions,
    });
    res.status(201).json(jobEvaluationCriteria);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create job evaluation criteria' });
  }
};

// Get all Job Evaluation Criteria for a specific job
exports.getJobEvaluationCriteria = async (req, res) => {
  try {
    const { job_id } = req.params;
    const criteria = await JobEvaluationCriteria.findAll({ where: { job_id } });
    res.status(200).json(criteria);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve job evaluation criteria' });
  }
};

// Update a Job Evaluation Criteria by ID
exports.updateJobEvaluationCriteria = async (req, res) => {
  try {
    const { id } = req.params;
    const { priority=1, instructions } = req.body;
    const jobEvaluationCriteria = await JobEvaluationCriteria.findByPk(id);
    if (!jobEvaluationCriteria) {
      return res.status(404).json({ error: 'Job evaluation criteria not found' });
    }
    jobEvaluationCriteria.priority = priority;
    jobEvaluationCriteria.instructions = instructions;
    await jobEvaluationCriteria.save();
    res.status(200).json(jobEvaluationCriteria);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update job evaluation criteria' });
  }
};

// Delete a Job Evaluation Criteria by ID
exports.deleteJobEvaluationCriteria = async (req, res) => {
  try {
    const { id } = req.params;
    const jobEvaluationCriteria = await JobEvaluationCriteria.findByPk(id);
    if (!jobEvaluationCriteria) {
      return res.status(404).json({ error: 'Job evaluation criteria not found' });
    }
    await jobEvaluationCriteria.destroy();
    res.status(204).json({ message: 'Job evaluation criteria deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete job evaluation criteria' });
  }
};
