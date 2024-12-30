const axios = require('axios');
const { customJsonParser } = require('../utils/customLLMOutputJsonUtils');
const {nodeReactInterview1} = require('../referenceExamplesForPrompts/nodeReactInterview1');
const {greenEnergyAssessment} = require('../referenceExamplesForPrompts/greenEnergyAssessment');
const {nodeReactInterview1Prompts}=require('../prompts/nodeReactInterview1Prompts');
const { techInternScreeningQuestions } = require('../assessmentQuestions/techInternScreeningQuestions1');
const { replacePlaceholders } = require('../utils/promptGenerator');
const { weightedAverage } = require('../utils/mathUtils');

const getQuestionsForSection = (formTitle, section) => {
  // Debugging: Log the structure of questionsData to ensure it's correct
  //console.log('questionsData:', techInternScreeningQuestions);
  if (formTitle === 'Assessment Green Energy') {
    if (section === 'logicalReasoning') {
      return {
        background_video_script: techInternScreeningQuestions.green_energy_case_study.background_video_script,
        questions: techInternScreeningQuestions.green_energy_case_study.questions
      };
    }
  } else if (formTitle === 'Tech Intern Screening') {
    if (section === 'functionalSkills') {
      return {
        nodejs_questions: techInternScreeningQuestions.technical_questions.nodejs,
        reactjs_questions: techInternScreeningQuestions.technical_questions.reactjs,
      };
    } else if (section === 'communication' || section === 'personalityTraits') {
      return {
        hr_questions: techInternScreeningQuestions.hr_questions
      };
    }
  }
  return null;
};


// Function to call OpenAI and get scores
const getOpenAIScore = async (prompt, model = 'gpt-4o', temperature = 0.3, num_samples = 5) => {
  const apiKey = process.env.OPENAI_API_KEY;
  const url = 'https://api.openai.com/v1/chat/completions';

  const messages = [
    { role: 'system', content: 'You are an expert in evaluating job interviews. Provide a score based on the given details.' },
    { role: 'user', content: prompt }
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
      //console.log("Open AI Response for ${section}: ", response);

      let responseText = response.data.choices[0].message.content.trim();

      // Use custom JSON parser
      responseText = customJsonParser(responseText);
      console.log(`OpenAI Response for sample ${i + 1}: `, responseText);
      responses.push(JSON.parse(responseText));
    }
    // Recalculate total scores
    const recalculateTotalScores = (scores) => {
      return scores.map(score => {
        try {
          const recalculatedTotal = score.question_scores.reduce((sum, question) => sum + parseInt(question.score), 0);
          console.log(`Recalculated total score for one response: ${recalculatedTotal}`);
          return { ...score, recalculated_total: recalculatedTotal };
        } catch (error) {
          console.error('Error recalculating total score:', error);
          return score;
        }
      });
    };

    const recalculatedResponses = recalculateTotalScores(responses);
    console.log("Recalculated responses:", recalculatedResponses);

    // Averaging the scores
    const averageScores = (scores) => {
      const result = {};
    
    
      const findClosestIndex = (arr, value) => {
        return arr.reduce((closestIndex, currentValue, index) => {
          return (Math.abs(currentValue - value) < Math.abs(arr[closestIndex] - value)) ? index : closestIndex;
        }, 0);
      };
    
      for (const section in scores[0]) {
        try {

          const sectionScores = scores.map(score => score[section]);
    
        if (section === 'question_scores') {
          const questionScores = [];
          for (let i = 0; i < sectionScores[0].length; i++) {
            const questionId = sectionScores[0][i].question_id;
            //const avgScore = sectionScores.reduce((sum, curr) => sum + curr[i].score, 0) / numSamples;
            const individualScores = sectionScores.map(score => parseInt(score[i].score));
            const avgScore = weightedAverage(individualScores);



            const closestIndex = findClosestIndex(individualScores, avgScore);
            
            const qualitativeAssessment = sectionScores[closestIndex][i].qualitative_assessment;
    
            questionScores.push({
              question_id: questionId,
              qualitative_assessment: qualitativeAssessment,
              score: avgScore
            });
          }
          result[section] = questionScores;
        } else if (section === 'recalculated_total') {
          console.log("recalculated_total section scores array:", sectionScores);
          const recalculatedTotals = sectionScores.map(score => parseInt(score));
          console.log("recalculated_total parse Int array:", recalculatedTotals);
          const avgTotalScore = weightedAverage(recalculatedTotals);;

          result['total_score'] = avgTotalScore;
    
          const closestIndex = findClosestIndex(sectionScores, avgTotalScore);
          result['cheating_flags'] = scores[closestIndex].cheating_flags;
        } else {
          result[section] = sectionScores[0]; // For other static sections if any
        }

        }catch (error) {
          console.error(`Error processing section ${section}:`, error);
          result[section] = sectionScores[0]; // Return the first entry as fallback
        }
        
      }
    
      return result;
    };  
    const finalScores = averageScores(recalculatedResponses);
    console.log("Final aggregated scores:", finalScores);
    return finalScores;
  } catch (error) {
    console.error('Error generating score:', error);
    throw error;
  }
};

// Function to call OpenAI and get scores
const getQualitativeOpenAIScore = async (prompt, model = 'gpt-4o', temperature = 0.3) => {
  const apiKey = process.env.OPENAI_API_KEY;
  const url = 'https://api.openai.com/v1/chat/completions';

  const messages = [
    { role: 'system', content: 'You are an expert in evaluating job interviews. Provide a score based on the given details.' },
    { role: 'user', content: prompt }
  ];

  try {
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
    //console.log("Open AI Response for ${section}: ", response);

    let responseText = response.data.choices[0].message.content.trim();

    // Parsing JSON
    responseText = customJsonParser(responseText);
    console.log("Open AI Response for ${section}: ", responseText);
    
    return JSON.parse(responseText);
  } catch (error) {
    console.error(`Error generating score for ${section}:`, error);
    throw error;
  }
};

const calculateInterviewScore = async (formTitle, interviewData) => {
  const sections = formTitle === 'Assessment Green Energy' ? ['logicalReasoning'] : ['functionalSkills', 'communication', 'personalityTraits'];
  const scores = {};

  for (const section of sections) {
    try {
      const questionsForSection = getQuestionsForSection(formTitle, section);
      if (!questionsForSection) {
        throw new Error(`No questions found for section: ${section} in form title: ${formTitle}`);
      }

      let placeholders = {};

      if (formTitle === 'Assessment Green Energy' && section === 'logicalReasoning') {
        placeholders = {
          QUESTIONS: JSON.stringify(questionsForSection.questions),
          BACKGROUND_VIDEO_SCRIPT: questionsForSection.background_video_script,
          REFERENCE_RESPONSES_WITH_SCORES: JSON.stringify(greenEnergyAssessment),
          TRANSCRIPT: interviewData
        };
      } else if (section === 'functionalSkills') {
        placeholders = {
          NODEJS_QUESTIONS: JSON.stringify(questionsForSection.nodejs_questions),
          REACTJS_QUESTIONS: JSON.stringify(questionsForSection.reactjs_questions),
          REFERENCE_RESPONSES_WITH_SCORES: JSON.stringify(nodeReactInterview1),
          TRANSCRIPT: interviewData
        };
      } else if (section === 'communication') {
        placeholders = {
          HR_QUESTIONS: JSON.stringify(questionsForSection.hr_questions),
          NODEJS_QUESTIONS: JSON.stringify(questionsForSection.nodejs_questions),
          REACTJS_QUESTIONS: JSON.stringify(questionsForSection.reactjs_questions),
          TRANSCRIPT: interviewData
        };
      } else if (section === 'personalityTraits') {
        placeholders = {
          HR_QUESTIONS: JSON.stringify(questionsForSection.hr_questions),
          TRANSCRIPT: interviewData
        };
      }

      const promptTemplate = nodeReactInterview1Prompts.prompts[section];
      const promptContent = replacePlaceholders(promptTemplate, placeholders);
      //console.log('Prompt:', promptContent);

      if (section === 'logicalReasoning' || section === 'functionalSkills') {
        scores[section] = await getOpenAIScore(promptContent);
      } else {
        scores[section] = await getQualitativeOpenAIScore(promptContent);
      }
    } catch (error) {
      console.error(`Error scoring section ${section}:`, error);
    }
  }

  return scores;
};


module.exports = { calculateInterviewScore };