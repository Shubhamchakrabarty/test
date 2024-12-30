const axios = require('axios');
const promptData = require('../prompts/promptTemplate');

// Base URLs for dev and prod
const baseURLDev = 'http://localhost:5000';
const baseURLProd = 'https://pehchaan.me';

// Function to send POST request
const sendPostPrompt = async (baseURL) => {
    try {
      const response = await axios.post(`${baseURL}/api/job-interview-prompts`, promptData);
      console.log(`POST: Prompt for client_job_interview_id ${promptData.client_job_interview_id} sent successfully to ${baseURL}`);
    } catch (error) {
      console.error(`Error with POST to ${baseURL}:`, error.message);
    }
  };
  
  // Function to send PUT request
  const sendPutPrompt = async (baseURL, id) => {
    try {
      const response = await axios.put(`${baseURL}/api/job-interview-prompts/${id}`, promptData);
      console.log(`PUT: Prompt with ID ${id} updated successfully in ${baseURL}`);
    } catch (error) {
      console.error(`Error with PUT to ${baseURL}:`, error.message);
    }
  };
  
  // Switch based on command line arguments
  const environment = process.argv[2]; // 'dev' or 'prod'
  const method = process.argv[3]; // 'POST' or 'PUT'
  const id = process.argv[4]; // ID required for PUT
  
  // Function to handle API calls based on environment and method
  const executePromptApiCall = async () => {
    const baseURL = environment === 'dev' ? baseURLDev : baseURLProd;
  
    if (method === 'POST') {
      await sendPostPrompt(baseURL);
    } else if (method === 'PUT') {
      if (!id) {
        console.error('PUT method requires an ID as the fourth argument.');
        return;
      }
      await sendPutPrompt(baseURL, id);
    } else {
      console.error('Invalid method. Use "POST" or "PUT"');
    }
  };
  
  // Execute the function
  executePromptApiCall();