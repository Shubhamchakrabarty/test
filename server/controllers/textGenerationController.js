const generativeAIService = require('../services/generativeAIService');

// Getting responses from OpenAI API 
const generateInterviewQuestions = async (req, res) => {
    const { userQuery } = req.body;

    if (!userQuery) {
        return res.status(400).json({ error: 'User query is required' });
    }

    try {
        // const { advice, youtubeLinks } = await generativeAIService.generateInterviewQuestions(userQuery);
        const questions = await generativeAIService.generateInterviewQuestions(userQuery);
        // Return both fields in the response
        res.json({ questions });
    } catch (error) {
        console.error('Error getting career advice:', error);
        res.status(500).json({ error: 'Error generating career advice' });
    }
};

// Getting responses from OpenAI API 
const generateReferenceAnswers = async (req, res) => {
    const { userQuery, gptModelName } = req.body;

    if (!userQuery) {
        return res.status(400).json({ error: 'User query is required' });
    }

    try {
        // const { advice, youtubeLinks } = await generativeAIService.generateInterviewQuestions(userQuery);
        const answers = await generativeAIService.generateReferenceAnswers(userQuery, model = gptModelName);
        // Return both fields in the response
        res.json({ answers });
    } catch (error) {
        console.error('Error getting reference answers:', error);
        res.status(500).json({ error: 'Error generating reference answers' });
    }
};

module.exports = {
    generateInterviewQuestions,
    generateReferenceAnswers
};
