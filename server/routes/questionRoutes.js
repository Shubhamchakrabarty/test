// routes/questionRoutes.js

const express = require('express');
const router = express.Router();
const { createQuestion, getQuestionById, updateQuestion, deleteQuestion } = require('../controllers/questionController');

router.post('/questions', createQuestion);         // Create
router.get('/questions/:id', getQuestionById);     // Read
router.put('/questions/:id', updateQuestion);      // Update
router.delete('/questions/:id', deleteQuestion);   // Delete


module.exports = router;