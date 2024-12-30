// server/utils/otpUtils.js
const { sendOTP } = require('../services/fast2sms');
const { sendOTPEmail } = require('../jobs/emailSendJob');
const userService = require('../services/userService');
const NodeCache = require('node-cache');

// Initialize cache with a 5-minute TTL (300 seconds)
const otpCache = new NodeCache({ stdTTL: 300 });

const generateAndSendOTP = async (phoneNumber, email) => {
  let smsSent = false;
  let emailSent = false;
  let otpResponse = null;
  try {
    const otp = Math.floor(100000 + Math.random() * 900000);
    otpCache.set(phoneNumber, otp);
    console.log(`OTP: ${otp} cached for phoneNumber: ${phoneNumber}`);
    try {
      const otpResponse_Child = await sendOTP(phoneNumber, otp);
      smsSent = true;
      otpResponse = otpResponse_Child;
      console.log('OTP sent via SMS successfully');
    } catch (smsError) {
      console.error('Error sending OTP via SMS:', smsError.message);
    }

    try {
      await sendOTPEmail(email, otp);
      emailSent = true;
      console.log('OTP sent via email successfully');
    }
    catch (emailError) {
      console.error('Error sending OTP via email:', emailError.message);
      throw new Error('Error sending OTP via email');
    }
    return {
      success: true,
      message: 'OTP process completed',
      smsSent,
      emailSent,
      otpResponse,
    };
  }
  catch (error) {
    if (error.message && error.message.includes('Spamming detected')) {
      console.error('OTP limit reached:', error.message);
      throw new Error('OTP limit reached. Please wait 30 minutes before trying again.');
    }
    throw new Error('Error sending OTP. Try again after 30 mins');
  }
};

module.exports = {
  generateAndSendOTP,
  otpCache,
};