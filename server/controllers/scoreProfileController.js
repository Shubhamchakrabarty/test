//const scoreProfileQueue = require('../jobs/scoreProfileJob');
const { addScoreProfileJob } = require('../jobs/scoreProfileJob');
const hrInterviewScoreQueue = require('../jobs/hrInterviewScoreJob');
const { Users, Score, HrInterviewResponse, HrInterviewScore, } = require('../models');

const scoreProfile = async (req, res) => {
  try {
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Fetch the user's experience level from the database
    const user = await Users.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user_type = user.experienceLevel;

    // Enqueue the job for background processing
    await addScoreProfileJob({ user_id, user_type });

    // Respond to the user immediately
    res.status(200).json({ message: 'Profile scoring job added to the queue' });
  } catch (error) {
    console.error('Error scoring profile:', error);
    res.status(500).json({ message: 'Error scoring profile' });
  }
};

const getLatestScore = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    const latestScore = await Score.findOne({
      where: { user_id: userId },
      order: [['created_at', 'DESC']],
    });

    if (!latestScore) {
      console.log(`No scores found for user ID ${userId}`);
      return res.status(404).json({ message: 'No scores found for the user' });
    }

    console.log(`Score found for user ID ${userId}:`);
    res.status(200).json(latestScore);
  } catch (error) {
    console.error('Error fetching latest score:', error);
    res.status(500).json({ message: 'Error fetching latest score' });
  }
};

const scoreInterview = async (req, res) => {
  try {
    const { email, formTitles } = req.body;

    if (!email || !formTitles || !Array.isArray(formTitles) || formTitles.length === 0) {
      return res.status(400).json({ message: 'Email and form titles are required' });
    }

    // Enqueue the job for background processing
    await hrInterviewScoreQueue.add({ email, formTitles });

    res.status(200).json({ message: 'Interview scoring job added to the queue' });
  } catch (error) {
    console.error('Error scoring interview:', error);
    res.status(500).json({ message: 'Error scoring interview' });
  }
};

const getLatestInterviewScore = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    const latestScore = await HrInterviewScore.findOne({
      where: { userId },
      order: [['createdAt', 'DESC']],
    });

    if (!latestScore) {
      return res.status(404).json({ message: 'No scores found for the user' });
    }

    res.status(200).json(latestScore);
  } catch (error) {
    console.error('Error fetching latest interview score:', error);
    res.status(500).json({ message: 'Error fetching latest interview score' });
  }
};

module.exports = { scoreProfile, getLatestScore, scoreInterview, getLatestInterviewScore };