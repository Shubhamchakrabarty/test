// routes/interviewQuestionRoutes.js

const express = require('express');
const router = express.Router();
const interviewQuestionController = require('../controllers/interviewQuestionController');

router.post('/link', interviewQuestionController.linkQuestionToInterview);

module.exports = router;
