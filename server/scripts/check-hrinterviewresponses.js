const { HrInterviewResponse } = require('../models');

(async () => {
  try {
    const responses = await HrInterviewResponse.findAll();
    responses.forEach(response => {
      console.log('ID:', response.id);
      console.log('Response:', response.response); // This should be a JSON object
    });
  } catch (error) {
    console.error('Error fetching HrInterviewResponses:', error);
  }
})();