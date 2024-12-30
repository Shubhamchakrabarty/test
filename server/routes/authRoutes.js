// server/routes/authRoutes.js
const express = require('express');
const { signUp, verifyOTP, login, resendOTP, clientLogin, clientVerifyOTP, clientResendOTP, checkUserExists, createUser } = require('../controllers/authController');

const router = express.Router();

router.post('/signup', signUp);
router.post('/verify-otp', verifyOTP);
router.post('/login', login);
router.get('/check-user/:phoneNumber', checkUserExists);
router.post('/create-user', createUser);
router.post('/resend-otp', resendOTP);
router.post('/client/login', clientLogin);
router.post('/client/verify-otp', clientVerifyOTP);
router.post('/client/resend-otp', clientResendOTP);


module.exports = router;