// server/services/fast2sms.js
const axios = require('axios');

const sendOTP = async (phoneNumber, otp) => {
  const url = 'https://www.fast2sms.com/dev/bulkV2';
  const headers = {
    authorization: process.env.FAST2SMS_API_KEY,
  };
  const data = {
    variables_values: otp,
    route: 'otp',
    numbers: phoneNumber,
  };
  console.log('Sending OTP to Fast2SMS API:', { url, headers, data });

  try {
    const response = await axios.post(url, data, { headers });
    console.log('Fast2SMS API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error from Fast2SMS API:', error.response ? error.response.data : error.message);
    throw new Error(
      error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : error.message
    );
  }
};

module.exports = { sendOTP };