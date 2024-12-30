const express = require('express');
const router = express.Router();
const { getCvDetails, cvScreeningRequirements } = require('../controllers/cvDetailsController');

// to get the cv details
router.get('/cv-details/:user_id/:job_id', getCvDetails);  // needs user id and job id in the request body

module.exports = router;
