const fs = require('fs');
const path = require('path');
const {nodeReactInterview1} = require('../referenceExamplesForPrompts/nodeReactInterview1');
const { JobInterviewPrompt, ReferenceAnswer } = require('../models');

// Function to load schema from schemas folder
const loadSchema = (section) => {
  const schemaPath = path.join(__dirname, '..', 'schemas', `${section}.json`);
  try {
    return JSON.stringify(JSON.parse(fs.readFileSync(schemaPath, 'utf8')), null, 2);
  } catch (error) {
    throw new Error(`Error loading schema for section ${section}: ${error.message}`);
  }
};

// Function to generate prompt with schema injected
const generatePrompt = (module_name, section, includeSchema = true) => {
    const promptsFilePath = path.join(__dirname, '..', 'prompts', `${module_name}.json`);

    // Check if the file exists
    if (!fs.existsSync(promptsFilePath)) {
        throw new Error(`Prompt file ${module_name}.json not found`);
    }

    const sectionPrompts = JSON.parse(fs.readFileSync(promptsFilePath, 'utf8')).prompts;

    if (!sectionPrompts[section]) {
        throw new Error(`No prompt found for section ${section} in module ${module_name}`);
    }

    if (includeSchema) {
        const schema = loadSchema(section);
        return sectionPrompts[section].replace('<<SCHEMA>>', schema);
      } else {
        return sectionPrompts[section];
      }
   
};


const generateRetryMessage = (parseError, parsedData, section) => {
    let errorMessage = 'The following error occurred while parsing JSON: ';
    errorMessage += `${parseError.message}.`;
  
    // Specific error messages
    if (parseError.message.includes('Unexpected token')) {
      errorMessage += ' Please ensure that all JSON syntax is correct, including commas, brackets, and quotes.';
    } else if (parseError.message.includes('Unexpected end of JSON input')) {
      errorMessage += ' It seems the JSON data might be incomplete. Ensure all objects and arrays are properly closed.';
    } else if (parseError.message.includes('Unexpected string in JSON at position')) {
      errorMessage += ' There might be an issue with string formatting or escaping. Ensure all strings are properly quoted and escaped if necessary.';
    } else if (parseError.message.includes('Unexpected number in JSON at position')) {
      errorMessage += ' Check for any unexpected numbers or misplaced values in the data.';
    }
  
    // General guidance
    errorMessage += ' Additionally, please ensure that:';
    errorMessage += ' 1. The JSON object starts and ends properly with curly braces { }.';
    errorMessage += ' 2. All keys and string values are enclosed in double quotes " ".';
    errorMessage += ' 3. No additional text or comments are present before or after the JSON object.';
    errorMessage += ' 4. There is a comma "," after each property value, except the last property in an object.';
    errorMessage += ' 5. The response should contain **only** the JSON object as specified in the format, without any extra commentary or explanations.';
  
    // Include the schema in the message
    try {
      const schema = loadSchema(section);
      errorMessage += ` The JSON schema you should follow is:\n${schema}`;
    } catch (error) {
      console.error(`Error loading schema for section ${section}: ${error.message}`);
    }
  
    errorMessage += ` Please correct and retry parsing the data: ${parsedData}.`;
  
    return errorMessage;
  };

  const replacePlaceholders = (template, placeholders) => {
    let result = template;
    for (const [key, value] of Object.entries(placeholders)) {
      const placeholder = `<<${key}>>`;
      result = result.replace(new RegExp(placeholder, 'g'), value);
    }
    return result;
  };

  // Function to fetch reference answers based on interview_question_id and skillName
  const getReferenceAnswers = async(evaluationCategoryId, interviewQuestionId) => {
    // Fetch reference answers from the database
    const referenceAnswers = await ReferenceAnswer.findAll({
      where: {
        interview_question_id: interviewQuestionId,
        evaluation_category_id: evaluationCategoryId
      }
    });
    return referenceAnswers ? referenceAnswers : null;
  };

  const countTokens = (text) => {
    return text.split(/\s+/).length;
  };

  // Fetch the prompt directly from the database model
const fetchPromptFromDB = async (clientJobInterviewId, evaluationCategoryId) => {
  try {
    const promptRecord = await JobInterviewPrompt.findOne({
      where: {
        client_job_interview_id: clientJobInterviewId,
        evaluation_category_id: evaluationCategoryId
      }
    });

    if (!promptRecord) {
      throw new Error('Prompt not found for the given clientJobInterviewId and evaluationCategoryId');
    }

    return promptRecord.prompt_text;  // Assuming 'prompt_text' is the column that holds the prompt
  } catch (error) {
    console.error('Error fetching prompt:', error.message);
    throw new Error('Failed to fetch prompt from the database');
  }
};

module.exports = {
  generatePrompt, 
  generateRetryMessage,
  replacePlaceholders,
  countTokens,
  getReferenceAnswers,
  fetchPromptFromDB
};