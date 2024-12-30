const { JobInterviewPrompt, ReferenceAnswer } = require('../models');

// Create a new Job Interview Prompt
exports.createJobInterviewPrompt = async (req, res) => {
  try {
    const { client_job_interview_id, evaluation_category_id, prompt_text, scoring_criteria } = req.body;
    const jobInterviewPrompt = await JobInterviewPrompt.create({
      client_job_interview_id,
      evaluation_category_id,
      prompt_text,
      scoring_criteria,
    });
    res.status(201).json(jobInterviewPrompt);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create job interview prompt' });
  }
};

// Get all Job Interview Prompts for a specific interview
exports.getJobInterviewPrompts = async (req, res) => {
  try {
    const { client_job_interview_id } = req.params;
    const prompts = await JobInterviewPrompt.findAll({
      where: { client_job_interview_id }
    });
    res.status(200).json(prompts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve job interview prompts' });
  }
};

// Update a Job Interview Prompt by ID
exports.updateJobInterviewPrompt = async (req, res) => {
  try {
    const { id } = req.params;
    const { prompt_text, scoring_criteria } = req.body;
    const jobInterviewPrompt = await JobInterviewPrompt.findByPk(id);
    if (!jobInterviewPrompt) {
      return res.status(404).json({ error: 'Job interview prompt not found' });
    }
    jobInterviewPrompt.prompt_text = prompt_text;
    jobInterviewPrompt.scoring_criteria = scoring_criteria;
    await jobInterviewPrompt.save();
    res.status(200).json(jobInterviewPrompt);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update job interview prompt' });
  }
};

// Delete a Job Interview Prompt by ID
exports.deleteJobInterviewPrompt = async (req, res) => {
  try {
    const { id } = req.params;
    const jobInterviewPrompt = await JobInterviewPrompt.findByPk(id);
    if (!jobInterviewPrompt) {
      return res.status(404).json({ error: 'Job interview prompt not found' });
    }
    await jobInterviewPrompt.destroy();
    res.status(204).json({ message: 'Job interview prompt deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete job interview prompt' });
  }
};

// Create a new Reference Answer
exports.createReferenceAnswer = async (req, res) => {
    try {
      const { interview_question_id, evaluation_category_id, answer, score } = req.body;
      const referenceAnswer = await ReferenceAnswer.create({
        interview_question_id,
        evaluation_category_id,
        answer,
        score,
      });
      res.status(201).json(referenceAnswer);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create reference answer' });
    }
  };
  
  // Get all Reference Answers for a specific interview question
  exports.getReferenceAnswers = async (req, res) => {
    try {
      const { interview_question_id } = req.params;
      const referenceAnswers = await ReferenceAnswer.findAll({
        where: { interview_question_id }
      });
      res.status(200).json(referenceAnswers);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve reference answers' });
    }
  };
  
  // Update a Reference Answer by ID
  exports.updateReferenceAnswer = async (req, res) => {
    try {
      const { id } = req.params;
      const { answer, score } = req.body;
      const referenceAnswer = await ReferenceAnswer.findByPk(id);
      if (!referenceAnswer) {
        return res.status(404).json({ error: 'Reference answer not found' });
      }
      referenceAnswer.answer = answer;
      referenceAnswer.score = score;
      await referenceAnswer.save();
      res.status(200).json(referenceAnswer);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update reference answer' });
    }
  };
  
  // Delete a Reference Answer by ID
  exports.deleteReferenceAnswer = async (req, res) => {
    try {
      const { id } = req.params;
      const referenceAnswer = await ReferenceAnswer.findByPk(id);
      if (!referenceAnswer) {
        return res.status(404).json({ error: 'Reference answer not found' });
      }
      await referenceAnswer.destroy();
      res.status(204).json({ message: 'Reference answer deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete reference answer' });
    }
  };
