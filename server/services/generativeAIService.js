const axios = require('axios');
const { customJsonParser } = require('../utils/customLLMOutputJsonUtils');
const { generatePrompt, generateRetryMessage } = require('../utils/promptGenerator');

const classifyCvText = async (extractedText, section, model = 'gpt-4o', prompt_module_name = 'cvTextClassificationPrompts') => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] Inside classifyCvText function using prompt section ${section}`);
  const apiKey = process.env.OPENAI_API_KEY;
  const url = 'https://api.openai.com/v1/chat/completions';
  
  let retryCount = 0;
  let apiFailCount = 0;
  const maxRetries = 3;
  const maxApiFailures = 5;
  
  // Define the classification prompt
  const classificationPrompt = generatePrompt(prompt_module_name, section, false);
  const messages = [
    { role: 'system', content: classificationPrompt },
    { role: 'user', content: "CV Data: " + extractedText }
  ];

  while (retryCount < maxRetries && apiFailCount < maxApiFailures) {
    try {
      // Step 1: Initial Classification
      const response = await axios.post(url, {
        model: model,
        messages: messages,
        max_tokens: 1500
      }, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      let classifiedData = response.data.choices[0].message.content;
      messages.push({ role: 'assistant', content: classifiedData });
      // Attempt to parse the cleaned data
      try {
        classifiedData = JSON.parse(customJsonParser(classifiedData));
        return classifiedData;  // Return valid JSON
      } catch (parseError) {
        console.error(`[${timestamp}] Error parsing JSON:`, parseError.message);
        retryCount++;

        if (retryCount < maxRetries) {
          const retryMessage = generateRetryMessage(parseError, classifiedData, section);
          messages.push({ role: 'user', content: retryMessage });
          console.log(`[${timestamp}] Retry parsing with error context: ${retryMessage}`);
        }
      }
    } catch (error) {
      console.error(`[${timestamp}] Error classifying CV text:`, error.response ? error.response.data : error.message);      
      apiFailCount++;
      if (apiFailCount >= maxApiFailures) {
        throw new Error(`API call failed ${apiFailCount} times. Aborting process.`);
      }
    }
  }

  throw new Error(`Failed to classify CV after ${maxRetries} retries.`);
};

const cvScreeningCheck = async (instructionData, cvData, model = 'gpt-4o')=> {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] Inside cvScreeningCheck function using model ${model}.`);
  const apiKey = process.env.OPENAI_API_KEY;
  const url = 'https://api.openai.com/v1/chat/completions';

  let retryCount = 0;
  let apiFailCount = 0;
  const maxRetries = 3;
  const maxApiFailures = 5;

  // Define the classification prompt
  const cvScreeningPrompt = `You are an expert in screening CV data of a candidate and comparing it against a list of job requirement instructions.`;
  const userPrompt = `The CV data is provided in a JSON string format, where each field represents some distinct section of the CV. List of instructions is given as a simple list of minimum requirements for the job.

  For each requirement in the given list, return an object with 2 fields. One 'requirement' field which simply states the original given requirement and a boolean field named 'satisfied', which represents if that 'requirement' is satisfied based on the parsed CV data.

  The instructions may mention about some timeframe or duration, in which case carefully check if the corresponding points are mentioned in the CV data and identify if they match the given requirements. 
  For example, if minimum 2 years of work experience is required and the work_experience in CV data has an entry with Start Date and End Date, calculate according to the current date and time if it clears that requirement. If end date is missing or not clear, then assume the CURRENT DATE to be the end date.

  ### Current Timestamp: ${timestamp}

  Strictly adhere to the given JSON response format while responding to the prompt and providing the status and return a text string containing the response without any extra punctuations or symbols.
  ### Response Format:
  {
    "job_requirements_status": [{ "requirement": "<requirement_1>", "satisfied": true, "reasoning": <reason for the satisfied field> }, { "requirement": "<requirement_2>", "satisfied": false, "reasoning": <reason for the satisfied field> }, { "requirement": "<requirement_2>", "satisfied": true, "reasoning": <reason for the satisfied field> }]
  }
  
  ### Client Job Requirement Instructions
  ${instructionData}

  ### Parsed CV Data
  ${cvData} 
  `
  const messages = [
    { role: 'system', content: cvScreeningPrompt },
    { role: 'user', content: userPrompt },
  ];

  while (retryCount < maxRetries && apiFailCount < maxApiFailures) {
    try {
      // Step 1: Initial Classification
      const response = await axios.post(url, {
        model: model,
        messages: messages,
        max_tokens: 1500
      }, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      let screeningData = response.data.choices[0].message.content;
      console.log(`[${timestamp}] CV Screening Result: ${screeningData}`);
      messages.push({ role: 'assistant', content: screeningData });

      // Use custom parser before attempting JSON.parse
      screeningData = customJsonParser(screeningData);
      // Attempt to parse the cleaned data
      try {
        screeningData = JSON.parse(screeningData);
        return screeningData;  // Return valid JSON
      } catch (parseError) {
        console.error(`[${timestamp}] Error parsing JSON:`, parseError.message);
        retryCount++;

        if (retryCount < maxRetries) {
          const retryMessage = generateRetryMessage(parseError, screeningData, section);
          messages.push({ role: 'user', content: retryMessage });
          console.log(`[${timestamp}] Retry parsing with error context: ${retryMessage}`);
        }
      }
    } catch (error) {
      console.error(`[${timestamp}] Error generating CV screening result`, error.response ? error.response.data : error.message);
      apiFailCount++;

      if (apiFailCount >= maxApiFailures) {
        throw new Error(`API call failed ${apiFailCount} times. Aborting process.`);
      }
    }
  }

  throw new Error(`Failed to screen CV after ${maxRetries} retries.`);
}

const parseCv = async (cvContent, section, model = 'gpt-4o', prompt_module_name = 'cvParsingPrompts') => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] Inside Open AI parseCv function`);
  const apiKey = process.env.OPENAI_API_KEY;
  const url = 'https://api.openai.com/v1/chat/completions';


  console.log(`[${timestamp}] Length of CV Content: ${cvContent.length}`);
  let retryCount = 0;
  let apiFailCount = 0;
  const maxRetries = 3;
  const maxApiFailures = 5;

  while (retryCount < maxRetries && apiFailCount < maxApiFailures) {
    try {
      const prompt = generatePrompt(prompt_module_name, section);
      const messages = [
        { role: 'system', content: 'You are an expert in parsing CVs. Extract relevant information and return in JSON format.' },
        { role: 'user', content: prompt + cvContent }
      ];
      //console.log(`[${timestamp}] Prompt Messages: ${JSON.stringify(messages)}`);
      console.log("About to make request to Open AI");
      const response = await axios.post(url, {
        model: model,
        messages: messages,
        max_tokens: 1500
      }, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      let parsedData = response.data.choices[0].message.content;
      console.log(`[${timestamp}] Open AI API parsed data: ${parsedData}`);
      messages.push({ role: 'assistant', content: parsedData });

      // Use custom parser before attempting JSON.parse
      parsedData = customJsonParser(parsedData);

      // Attempt to parse the cleaned data
      try {
        parsedData = JSON.parse(parsedData);
        return parsedData;  // Return valid JSON
      } catch (parseError) {
        console.error(`[${timestamp}] Error parsing JSON:`, parseError.message);
        retryCount++;

        if (retryCount < maxRetries) {
          const retryMessage = generateRetryMessage(parseError, parsedData, section);
          messages.push({ role: 'user', content: retryMessage });
          console.log(`[${timestamp}] Retry parsing with error context: ${retryMessage}`);
        }
      }
    } catch (error) {
      console.error(`[${timestamp}] Error parsing CV:`, error.response ? error.response.data : error.message);
      apiFailCount++;

      if (apiFailCount >= maxApiFailures) {
        throw new Error(`API call failed ${apiFailCount} times. Aborting process.`);
      }
    }
  }

  throw new Error(`Failed to parse CV after ${maxRetries} retries.`);
};


const getSuggestions = async (responseText, model = 'gpt-4o') => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] Inside Open AI get Suggestions function`);
  const apiKey = process.env.OPENAI_API_KEY;
  const url = 'https://api.openai.com/v1/chat/completions';

  const messages = [
    { role: 'system', content: 'You are a CV building expert advising students on how to improve elements of their CV.' },
    { role: 'user', content: `Provide suggestions to improve the following "Project Description": "${responseText}"` }
  ];

  console.log(`[${timestamp}] Prompt Messages: ${JSON.stringify(messages)}`);

  try {
    console.log("About to make request to Open AI");
    const response = await axios.post(url, {
      model: model,
      messages: messages,
      max_tokens: 250
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    console.log(`[${timestamp}] Response: ${JSON.stringify(response.data)}`);
    // Access the 'message' content from the first choice
    const suggestions = response.data.choices[0].message.content.trim();
    console.log(`[${timestamp}] Open AI API suggestions: ${suggestions}`);
    return suggestions;
  } catch (error) {
    console.error(`[${timestamp}] Error generating suggestions:`, error.response ? error.response.data : error.message);
    throw error;
  }
};

// For getting responses from OpenAI API 
const getCareerAdvice = async (userQuery, model = 'gpt-4o') => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] Inside getCareerAdvice function`);
  const apiKey = process.env.OPENAI_API_KEY;
  const systemPrompt = `You are an AI career expert agent. Your role is to provide concise and relevant answers to user inquiries related to career choices, potential income, growth opportunities, and qualifications. When appropriate, include links to useful YouTube videos, playlists, or channels that can help users further explore these topics. Respond only to career-related questions and maintain focus on the context. If the user asks for numerical values, provide them using the Indian numbering system (lakhs and crores), and express monetary values in INR, unless international currency is specified. Should the user diverge from career-related topics, politely prompt them to return to relevant questions. Ensure all answers are direct and succinct, avoiding unnecessary elaboration.`;
  const url = 'https://api.openai.com/v1/chat/completions';
  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userQuery }
  ];

  try {
    console.log("About to make request to OpenAI for career advice");
    const response = await axios.post(url, {
      model: model,
      messages: messages,
      max_tokens: 500
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    console.log(`[${timestamp}] Response: ${JSON.stringify(response.data)}`);
    const advice = response.data.choices[0].message.content.trim();
    console.log(`[${timestamp}] Career advice: ${advice}`);
    return advice;
  } catch (error) {
    console.error(`[${timestamp}] Error generating career advice:`, error.response ? error.response.data : error.message);
    throw error;
  }
};

const generateInterviewQuestions = async (userQuery, model = 'gpt-4o') => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] Inside generateInterviewQuestions function using model ${model}`);
  const apiKey = process.env.OPENAI_API_KEY;
  const systemPrompt = `You are an expert in generating a diverse range of questions for subject-specific interview. Please generate some relevant interview questions that align with the job description.`;

  const userPrompt = `The questions should assess the candidate's knowledge, skills, and critical thinking ability in the subject matter.
    Strictly adhere to the given JSON response format while responding to the prompt and providing questions and return a text string containing the response without any extra punctuations or symbols.
    
    If the 'Previously Generated Response' is also provided, take that section into consideration while generating questions.

    ### Response Format:
    ${userQuery.question_format}

    ### Given Interview Details:
    Job Title: ${userQuery.job_title}, 
    Job Description: ${userQuery.job_description}, 
    Interview Name: ${userQuery.interview_name}
    Context Text: ${userQuery.context_text}
  `;
  const url = 'https://api.openai.com/v1/chat/completions';
  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ];

  if(userQuery.previous_response && userQuery.previous_response.length !== 0) {
    console.log(`[${timestamp}] Response is based on previously generated Questions`);
    messages.push({ role: 'user', content: '### Previous Generated Response: ' + userQuery.previous_response + '\n\n### Query: ' + userQuery.text });
  } else {
    messages.push({ role: 'user', content: '### Query: ' + userQuery.text });
  }

  try {
    console.log("About to make request to OpenAI for generating interview questions");
    const response = await axios.post(url, {
      model: model,
      messages: messages,
      max_tokens: 1000,
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    console.log(`[${timestamp}] Response: ${JSON.stringify(response.data)}`);
    const questions = response.data.choices[0].message.content.trim();
    return questions;
  } catch (error) {
    console.error(`[${timestamp}] Error generating career advice:`, error.response ? error.response.data : error.message);
    throw error;
  }
};

const generateReferenceAnswers = async (userQuery, model = 'gpt-4o') => {
  console.log(`Using model: ${model}`)
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] Inside generateReferenceAnswers function`);
  const apiKey = process.env.OPENAI_API_KEY;
  const userPrompt = `
    Details provided:
    1. **Question Text**: ${userQuery.question_text}
    2. **Text Instructions**: ${userQuery.text_instructions}
    3. **Scoring Criteria**: ${userQuery.scoring_criteria}
    4. **Evaluation Criteria**: ${userQuery.evaluation_criteria}
    5. **Interview Name**: ${userQuery.interview_name}
    6. **Context**: ${userQuery.context}
  `;
  const systemPrompt = `You are tasked with generating reference answers for an interview question based on the given details. The interview is structured to assess candidates according to specific evaluation criteria, and the answers should be scored on a scale (e.g., 0-1 or 1-5). Please generate accurate reference answers for the given question, ensuring that the answers are aligned with the evaluation criteria and that different levels of scoring are clearly indicated.
  Strictly adhere to the given JSON response format while responding to the prompt and providing reference answers and return a text string containing the response without any extra punctuations or symbols.
  
  ### Response Format
  [
    { "score": <score>, "answer": <answer> },
    { "score": <score>, "answer": <answer> },
  ]
  
  
  For example:
  - For a score of 1 (or 0), provide a response that reflects a failure to meet the evaluation criteria.
  - For a score of 5 (or 1), provide a response that fully satisfies the evaluation criteria.
  
  Example reference answers for some question
  
  **Question Text**: Based on the given document, extract the full name, country of origin and date of birth (Given an image of a sample UK Driver License),
  **Text Instructions**: Based on the given document, extract the details
  **Scoring Criteria**: [0-1]
  **Evaluation Criteria**: Evaluate the candidate's ability to accurately identify errors, inconsistencies, or compliance issues within a document. This includes attention to detail and the ability to critically assess the content.
  **Context**: --
  **Reference Answers**: [{ "score": 0, "answer": "The response fails to correctly extracts the full name as 'Morgan Sarah Meredyth,' the country of origin as 'United Kingdom,' and the date of birth as '11/03/1976' from the provided UK Driver License." }, { "score": 1, "answer": "The response correctly extracts the full name as 'Morgan Sarah Meredyth,' the country of origin as 'United Kingdom,' and the date of birth as '11/03/1976' from the provided UK Driver License." }]


  **Question Text**: Tell us about yourself, What are your biggest strengths and worst weakanesses? What irriates you the most in your day to day life? What excites you the most ?,
  **Text Instructions**: To check your strengths and weaknesses
  **Scoring Criteria**: Assign a score in the range [0-5]
  **Evaluation Criteria**: Qualitative Assessment of candidate's personality and quantitative assessment of overall role-fit.
  **Context**: --
  **Reference Answers**: [{ "score": 5, "answer": "Growth Mindset: Shows a proactive attitude, emphasizes learning and growth. Outlines a clear plan for acquiring necessary skills. Resourcefulness: Mentions using resources like online courses, mentors, or networking. Confidence: Shows a willingness to take on challenges and learn on the job. Examples: Provides a past experience of overcoming a similar situation." }, { "score": 4, "answer": "Growth Mindset: Proactive but lacks a fully detailed learning plan. Resourcefulness: Mentions some resources but could be more specific. Confidence: Confident but may show some hesitation. Examples: Good response but lacks a strong example." }, { "score": 3, "answer": "Growth Mindset: Willing to learn but lacks clear steps or plan. Resourcefulness: Basic suggestions, not very specific. Confidence: Some uncertainty in taking on new challenges. Examples: Average, lacks depth or past experiences." }, { "score": 2, "answer": "Growth Mindset: Willing to try but lacks a clear learning plan. Resourcefulness: Vague suggestions like I'll try to learn. Confidence: Uncertain about abilities, hesitant. Examples: No relevant past experiences or clear steps." }, { "score": 1, "answer": "Growth Mindset: Reluctant to apply, no plan for improvement. Resourcefulness: No strategies mentioned, uninterested in learning. Confidence: Lacks confidence and motivation, avoids challenge. Examples: No examples or actionable steps provided." }]


  **Question Text**: From the story answer - How is India leading at global scale through innovation and participation?,
  **Text Instructions**: To test paraphrasing.
  **Scoring Criteria**: [0-5]
  **Evaluation Criteria**: Assess the candidate's ability to comprehend written information, retain key details, and respond accurately and clearly.
  **Context**: "India's Energy Transformation -   
  In this century, a transformative change is occurring in India's energy landscape. Renewable energy sources like wind, solar, and hydropower are not only reducing our dependence on fossil fuels but are also driving economic growth and innovation. Today, we will explore how renewable energy is reshaping our country and what its future looks like.
  Solar energy has become one of the fastest-growing power sources in India. With initiatives like the National Solar Mission, technological advancements have significantly reduced the cost of solar panels, making them more accessible than ever before.
  Wind energy generated from the movement of air is another key technology. States like Tamil Nadu and Gujarat are producing significant amounts of electricity with minimal environmental impact, thanks to their large-scale wind farms.
  Hydropower derived from flowing water has been used for centuries. With many rivers, India has great potential for hydropower generation, which is a vital part of our energy mix, capable of providing reliable and sustainable power.
  The shift to renewable energy is not just about technology; it's also about innovation. Researchers in India are developing various ways to store and distribute renewable energy, making it more efficient and reliable."

  **Reference Answers**: [{ "score": 5, "answer": "The response accurately mentions India's leadership through innovation in renewable energy, including advancements in energy storage and distribution, and India's commitment to global initiatives like the Paris Agreement. The answer is well-structured and captures all key points." }, { "score": 4, "answer": "The response covers most key points, such as India's role in innovation and participation in global agreements like the Paris Agreement, but may lack some depth or miss mentioning specific efforts in energy storage or distribution." }, { "score": 3, "answer": "The answer touches on India's leadership role but lacks specific details about innovation or participation in global agreements. The response is somewhat vague and misses important elements." }, { "score": 2, "answer": "The response is brief and vague, mentioning India's role in renewable energy but missing key details about global leadership, innovation, or participation in global initiatives." },{ "score": 1, "answer": "The response shows little understanding, failing to mention India's leadership in innovation or its global participation. The answer is incomplete or irrelevant." }]
  ,
  `;
  const previous_answers = userQuery.previous_answers;

  const url = 'https://api.openai.com/v1/chat/completions';
  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ];

  if(previous_answers) {
    messages.push({ role: 'user', content: previous_answers });
    messages.push({ role: 'user', content: userQuery.previous_answers_updates });
  }

  try {
    console.log("About to make request to OpenAI for generating reference answers");
    const response = await axios.post(url, {
      model: model,
      messages: messages,
      max_tokens: 500
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    console.log(`[${timestamp}] Response: ${JSON.stringify(response.data)}`);
    const answers = response.data.choices[0].message.content.trim();
    console.log(`[${timestamp}] Reference Answers: ${answers}`);
    return answers;
  } catch (error) {
    console.error(`[${timestamp}] Error generating reference answers:`, error.response ? error.response.data : error.message);
    throw error;
  }
};


// For getting responses from Perplexity API 
// const extractYouTubeLinks = (advice) => {
//   const regex = /(https?:\/\/(?:www\.)?youtube\.com\/watch\?v=[\w-]+)/g;
//   const links = advice.match(regex) || [];
//   return links;
// };
// const getCareerAdvice = async (userQuery) => {
//   const timestamp = new Date().toISOString();
//   console.log(`[${timestamp}] Inside getCareerAdvice function`);

//   const apiKey = process.env.PERPLEXITY_API_KEY;
//   const model = 'llama-3.1-sonar-huge-128k-online'; // Use a valid model name as per documentation
//   const systemPrompt = `
//   You are an AI career expert agent. Your responsibility is to provide concise, relevant, and accurate career guidance on topics such as career choices, potential earnings, growth opportunities, necessary qualifications, interview preparation, and job search strategies.

// Instructions:
// - Answer only questions related to career guidance, interview preparation, or job searches. Avoid coding tutorials, personal issues, or unrelated queries.
// - Include relevant YouTube links directly in the advice if applicable. If no links are available for the specific question, suggest general career-related videos.
// - Include any YouTube links as part of the advice text.
// - If the user asks about unrelated topics (e.g., "build a to-do list in React" or "help me, I am sick"), politely remind them to stick to career-related queries.
// - Keep all answers clear and concise. When appropriate, recommend our website "https://www.pehchaan.me/" for career development resources.

// Respond in plain text that contains both career advice and relevant YouTube links within the answer itself.
//   `;

//   const messages = [
//     { role: 'system', content: systemPrompt },
//     { role: 'user', content: userQuery }
//   ];

//   try {
//     console.log("About to make request to Perplexity for career advice");
//     const response = await axios.post('https://api.perplexity.ai/chat/completions', {
//       model: model,
//       messages: messages,
//       max_tokens: 1000,
//       temperature: 0.7,
//       top_p: 1.0,
//       return_citations: true
//     }, {
//       headers: {
//         'Authorization': `Bearer ${apiKey}`,
//         'Content-Type': 'application/json'
//       }
//     });

//     console.log(`[${timestamp}] Response: ${JSON.stringify(response.data)}`);
//     const content = response.data.choices[0].message.content.trim();
//     const youtubeLinks = extractYouTubeLinks(content);
//     console.log(`[${timestamp}] Raw content: ${content}`);
//     console.log("The youtube links obtained are : ", youtubeLinks);
//     return { advice: content, youtubeLinks };
//   } catch (error) {
//     console.error(`[${timestamp}] Error generating career advice:`, error.response ? error.response.data : error.message);
//     throw error;
//   }
// };





module.exports = { classifyCvText, getSuggestions, parseCv, getCareerAdvice, generateInterviewQuestions, generateReferenceAnswers, cvScreeningCheck };