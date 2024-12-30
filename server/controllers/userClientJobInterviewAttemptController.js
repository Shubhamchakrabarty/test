const { UserClientJobInterviewAttempt } = require('../models');

// Create a new interview attempt
const createInterviewAttempt = async (req, res) => {
  const { user_id, client_job_interview_id, question_set_attempted } = req.body;
  try {
    const newAttempt = await UserClientJobInterviewAttempt.create({
      user_id,
      client_job_interview_id,
      question_set_attempted,
      tab_switch_count: 0, // Initialize with 0
    });
    res.status(201).json(newAttempt);
  } catch (error) {
    console.error('Error creating interview attempt:', error);
    res.status(500).json({ message: 'Error creating interview attempt' });
  }
};

// Update the interview attempt (e.g., mark as completed)
const updateInterviewAttempt = async (req, res) => {
  const { id } = req.params;
  try {
    const attempt = await UserClientJobInterviewAttempt.findByPk(id);
    if (!attempt) {
      return res.status(404).json({ message: 'Interview attempt not found' });
    }
    await attempt.update({ interview_completed: true });
    res.status(200).json(attempt);
  } catch (error) {
    console.error('Error updating interview attempt:', error);
    res.status(500).json({ message: 'Error updating interview attempt' });
  }
};

// Fetch the interview attempt by ID
const getInterviewAttemptById = async (req, res) => {
  const { id } = req.params;
  try {
    const attempt = await UserClientJobInterviewAttempt.findByPk(id);
    if (!attempt) {
      return res.status(404).json({ message: 'Interview attempt not found' });
    }
    res.status(200).json(attempt);
  } catch (error) {
    console.error('Error fetching interview attempt:', error);
    res.status(500).json({ message: 'Error fetching interview attempt' });
  }
};

const getInterviewAttemptByClientJobInterviewId = async(req, res) => {
  const { clientJobInterviewId, userId } = req.query;
  try {
    const { count, rows } = await UserClientJobInterviewAttempt.findAndCountAll({
      where: {
        client_job_interview_id: clientJobInterviewId,
        user_id: userId,
      }
    });

    if (!rows) {
      return res.status(404).json({ message: 'Interview attempt not found' });
    }

    const completed = rows.reduce((total, row) => {
      if(row.interview_completed) return total + 1;
      return total;
    }, 0);
    
    res.status(200).json({ completed_count: completed, started_count: count, attempts: rows });
  } catch (error) {
    console.error('Error fetching interview attempt:', error);
    res.status(500).json({ message: 'Error fetching interview attempt' });
  }
};

const deleteInterviewAttemptByClientJobInterviewId = async(req, res) => {
  const { clientJobInterviewId, userId } = req.query;
  try {
    const result = await UserClientJobInterviewAttempt.destroy({
      where: {
        client_job_interview_id: clientJobInterviewId,
        user_id: userId,
      }
    });

    if (result === 0) {
      return res.status(404).json({ message: 'Interview attempt not found' });
    }
    res.status(200).json({ message: `Interview attempts deleted successfully client job interview id: ${clientJobInterviewId}, user id: ${userId}` });
  } catch (error) {
    console.error('Error fetching interview attempt:', error);
    res.status(500).json({ message: 'Error fetching interview attempt' });
  }
};

const updateTabSwitchCount = async (req, res) => {
  const { id } = req.params;
  const { tab_switch_count } = req.body;

  try {
    const attempt = await UserClientJobInterviewAttempt.findByPk(id);
    if (!attempt) {
      return res.status(404).json({ message: 'Interview attempt not found' });
    }

    // Update only tab_switch_count
    if (tab_switch_count !== undefined) {
      await attempt.update({ tab_switch_count });
    }

    res.status(200).json(attempt);
  } catch (error) {
    console.error('Error updating tab switch count:', error);
    res.status(500).json({ message: 'Error updating tab switch count' });
  }
};



module.exports = {
  createInterviewAttempt,
  updateInterviewAttempt,
  getInterviewAttemptById,
  getInterviewAttemptByClientJobInterviewId,
  deleteInterviewAttemptByClientJobInterviewId,
  updateTabSwitchCount,
};
