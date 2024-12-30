const express = require('express');
const router = express.Router();
const { generateInterviewQuestions, generateReferenceAnswers } = require('../controllers/textGenerationController');

router.post('/generate-interview-questions', generateInterviewQuestions);
router.post('/generate-reference-answers', generateReferenceAnswers);

module.exports = router;