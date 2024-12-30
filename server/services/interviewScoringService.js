const axios = require('axios');
const { customJsonParser } = require('../utils/customLLMOutputJsonUtils');
const { replacePlaceholders, getReferenceAnswers, fetchPromptFromDB } = require('../utils/promptGenerator');
const { weightedAverage, findClosestIndex, roundToTwoDecimalPlaces } = require('../utils/mathUtils');
//const { nodeReactInterview1Prompts } = require('../prompts/nodeReactInterview1Prompts');

// Utility function to process responses and calculate the weighted average score
const processScoringResponses = (responses) => {
  // Filter out any scores outside the range of 0 to 5
  const validResponses = responses.filter(response => response.score >= 0 && response.score <= 5);
  
  // Check if there are enough valid scores to proceed
  if (validResponses.length < 1) { // You can adjust the threshold as needed
    throw new Error('Insufficient valid scores after filtering.');
  }
  const scores = validResponses.map(response => response.score);
  const weightedAvgScore = roundToTwoDecimalPlaces(weightedAverage(scores));
  console.log("weightedAvgScore", weightedAvgScore);

  const closestIndex = findClosestIndex(scores, weightedAvgScore);
  const finalQualitativeAssessment = validResponses[closestIndex].qualitative_assessment;

  return { score: weightedAvgScore, qualitative_assessment: finalQualitativeAssessment };
};

const getOpenAIScoreForQuestion = async (promptContent, model = 'gpt-4o', temperature = 0.3, num_samples = 5) => {
  const apiKey = process.env.OPENAI_API_KEY;
  const url = 'https://api.openai.com/v1/chat/completions';

  const messages = [
    { role: 'system', content: 'You are an expert in evaluating job interviews. Provide a score based on the given details.' },
    { role: 'user', content: promptContent }
  ];

  try {
    const responses = [];
    for (let i = 0; i < num_samples; i++){
      const response = await axios.post(url, {
        model: model,
        messages: messages,
        max_tokens: 2000,
        temperature: temperature,
      }, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      let responseText = response.data.choices[0].message.content.trim();
      responseText = customJsonParser(responseText);
      responses.push(JSON.parse(responseText));
    }
    return processScoringResponses(responses);
  } catch (error) {
    console.error('Error generating score:', error);
    throw error;
  }
};

// Function to call OpenAI for interview-level scoring
const getOpenAIScoreForInterview = async (promptContent, model = 'gpt-4o', temperature = 0.3, num_samples = 5) => {
    const apiKey = process.env.OPENAI_API_KEY;
    const url = 'https://api.openai.com/v1/chat/completions';
  
    const messages = [
      { role: 'system', content: 'You are an expert in evaluating job interviews. Provide a comprehensive assessment based on the entire interview transcript.' },
      { role: 'user', content: promptContent }
    ];
  
    try {
      const responses = [];
      for (let i = 0; i < num_samples; i++) {
        const response = await axios.post(url, {
          model: model,
          messages: messages,
          max_tokens: 2000,
          temperature: temperature,
        }, {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        });
  
        let responseText = response.data.choices[0].message.content.trim();
        responseText = customJsonParser(responseText);
        responses.push(JSON.parse(responseText));
      }
  
      // Process responses to calculate weighted average score
      return processScoringResponses(responses);
    } catch (error) {
      console.error('Error generating interview-level score:', error);
      throw error;
    }
  };

  // Function to calculate the interview-level score
const calculateInterviewLevelScore = async (clientJobInterviewId, evaluationCategoryId, skillName, combinedTranscriptWithQuestions, contextVideoText) => {
    try {
      // Fetch the prompt from the database
      const promptTemplate = await fetchPromptFromDB(clientJobInterviewId, evaluationCategoryId);
  
      if (!promptTemplate) {
        throw new Error(`No prompt found for skill: ${skillName}`);
      }
  
      // Prepare the prompt by replacing placeholders
      const promptContent = replacePlaceholders(promptTemplate, {
        TRANSCRIPT: combinedTranscriptWithQuestions,
        CONTEXT_VIDEO_TEXT: contextVideoText
      });

      // Log the prompt content
      //console.log(`Generated Interview-Level Prompt for Client Job Interview ID: ${clientJobInterviewId}`);
      //console.log(promptContent);
  
      // Get the score for the interview level
      const score = await getOpenAIScoreForInterview(promptContent);
  
      return { skillName, score };
    } catch (error) {
      // Log and return the error so the process continues
      console.error(`Error scoring interview-level skill: ${skillName}`, error);
      return null;  // Return null to indicate no score could be computed
    }
  };

const calculateQuestionLevelScore = async (clientJobInterviewId, evaluationCategoryId, skillName, interviewQuestionId, interviewData, contextVideoText) => {
  try {
    // Fetch the prompt from the database
    const promptTemplate = await fetchPromptFromDB(clientJobInterviewId, evaluationCategoryId);

    if (!promptTemplate) {
      throw new Error(`No prompt found for skill: ${skillName}`);
    }
    // Fetch reference answers
    const referenceAnswers = await getReferenceAnswers(evaluationCategoryId, interviewQuestionId);
    if (!referenceAnswers || referenceAnswers.length === 0) {
      throw new Error(`No reference answers found for question ID: ${interviewQuestionId} and evaluation category ID: ${evaluationCategoryId}`);
    }

    // Sort and simplify reference answers, and ensure scores are numbers
    const simplifiedReferenceAnswers = referenceAnswers
      .map(({ answer, score }) => ({ answer, score: Number(score) }))  // Ensure score is a number
      .sort((a, b) => a.score - b.score);  // Sort by score in ascending order

    // Prepare the prompt by replacing placeholders
    const promptContent = replacePlaceholders(promptTemplate, {
      TRANSCRIPT: interviewData,
      REFERENCE_ANSWER: JSON.stringify(simplifiedReferenceAnswers),
      CONTEXT_VIDEO_TEXT: contextVideoText
    });

    // Log the prompt content
    //console.log(`Generated Question-Level Prompt for Interview Question ID: ${interviewQuestionId}`);
    //console.log(promptContent);

    // Get the score for the individual question or skill
    const score = await getOpenAIScoreForQuestion(promptContent);

    return { skillName, score };
  } catch (error) {
    // Log and return the error so the process continues
    console.error(`Error scoring question-level skill: ${skillName}`, error);
    return null;  // Return null to indicate no score could be computed
  }
};

function calculateTypingErrors(str1, str2) {
  // Split strings by spaces to create arrays of words
  const words1 = str1.trim().split(/\s+/);
  const words2 = str2.trim().split(/\s+/);

  let i = 0, j = 0; // Indices for words1 and words2
    let errors = 0;

    while (i < words1.length && j < words2.length) {
        const word1 = words1[i];
        let matched = false;

        // Check current and offsets up to 3
        for (let offset = 0; offset <= 3; offset++) {
            if (j + offset < words2.length && word1 === words2[j + offset]) {
                matched = true;
                j += offset; // Move question index by the offset
                break;
            }
        }

        if (matched) {
            i++;
            j++; // Move to the next words in both arrays
        } else {
          console.log("checking realignment, ", word1, words2[i]);
          if (i < words2.length && word1 === words2[i]) {
            i++;
            j = i; // Realign question index to transcript index
            console.log("realigned, i=", i, " j=", j);
          } else {
            errors++; // Count error and move to the next word
            console.log("errors", errors);
            console.log("error_word", word1);
            i++;
            j++;
          }
        }
    }

    // Count remaining unmatched words as errors
    if (words1.length - i > 0){
        errors += (words1.length - i);
        console.log("additonal_errors", words1.length - i);
    }

    return { errors ,num_words_accuracy: words1.length };
}

const calculateTypingScore = async (clientJobInterviewId, evaluationCategoryId, skillName, questionsArray, transcriptsArray, totalTimeTaken) => {
  try {
      let totalErrors = 0;
      let totalWords = 0;
      let totalWordsAccuracy=0;

      // Iterate over all question-transcript pairs
      for (let i = 0; i < questionsArray.length; i++) {
          const question = questionsArray[i];
          const transcript = transcriptsArray[i];

          // Calculate errors for the current pair
          const { errors, num_words_accuracy } = calculateTypingErrors(transcript, question);
          totalErrors += errors;
          totalWordsAccuracy += num_words_accuracy;


          // Calculate the number of words in the transcript
          const wordCount = Math.ceil(transcript.trim().length / 5);
          totalWords += wordCount;
      }

      // Calculate typing speed based on total words and total time taken
      const grossSpeed = totalWords / (totalTimeTaken / 60);
      const accuracy = Number((((totalWordsAccuracy - totalErrors) / totalWordsAccuracy) * 100).toFixed(1));
      //const netSpeed = grossSpeed * (accuracy / 100); 
      const totalMinutes = Math.floor(totalTimeTaken / 60);
      const totalSeconds = totalTimeTaken % 60;
      const formattedTime = `${totalMinutes} minutes ${totalSeconds} seconds`;


      return {
        gross_speed_wpm: Number(grossSpeed.toFixed(1)),
        accuracy: accuracy,
        total_words: totalWords,
        total_words_accuracy: totalWordsAccuracy,
        total_errors: totalErrors,
        total_time_taken: formattedTime,
      };
  } catch (error) {
      console.error('Error calculating typing score:', error);
      return null; // Return null to indicate no score could be computed
  }
};




module.exports = { calculateQuestionLevelScore, calculateInterviewLevelScore, calculateTypingScore };
