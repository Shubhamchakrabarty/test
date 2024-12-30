const axios = require('axios');
const { replacePlaceholders, generateRetryMessage } = require('../utils/promptGenerator');
const { customJsonParser } = require('../utils/customLLMOutputJsonUtils');
const { weightedAverage, roundToTwoDecimalPlaces } = require('../utils/mathUtils');
const { profileScoringPrompts } = require('../prompts/profileScoringPrompts');

// Function to count tokens (approximation)


const getOpenAIScore = async (section, content, model = 'gpt-4o', temperature = 0.3, num_samples = 5) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] Inside Open AI getOpenAIScore function for section: ${section}`);
  const apiKey = process.env.OPENAI_API_KEY;
  const url = 'https://api.openai.com/v1/chat/completions';
  // Get the relevant template for the section
  const promptTemplate = profileScoringPrompts.prompts[section];
  // Replace the placeholders with actual content
  const prompt = replacePlaceholders(promptTemplate, { content: JSON.stringify(content) });


  const messages = [
    { role: 'system', content: 'You are an expert in evaluating CVs. Provide a score based on the given details.' },
    { role: 'user', content: prompt }
  ];

  
    const responses = [];
    for (let i = 0; i < num_samples; i++){
      let retryCount = 0;
      const maxRetries = 3;
      while (retryCount < maxRetries){
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
    
          let responseText = response.data.choices[0].message.content.trim();
          // Use custom JSON parser
          responseText = customJsonParser(responseText);

          // Try parsing the cleaned response text
        let parsedResponse;
        try {
          parsedResponse = JSON.parse(responseText);
          responses.push(parsedResponse);
          break; // Exit the retry loop on successful parsing
          } catch (parseError) {
            retryCount++;
            console.error(`[${timestamp}] Error parsing JSON:`, parseError.message);

            if (retryCount < maxRetries) {
              const retryMessage = generateRetryMessage(parseError, responseText, section);
              messages.push({ role: 'user', content: retryMessage });
              console.log(`[${timestamp}] Retry parsing with error context: ${retryMessage}`);
            } else {
              console.warn(`Failed to parse response for ${section} after ${maxRetries} retries. Moving on to the next sample.`);
              break; // Exit the retry loop and continue with the next iteration
            }
          }

        }catch (error) {
          console.error(`[${timestamp}] Error generating score for ${section}:`, error.response ? error.response.data : error.message);
          break; // Exit the retry loop and continue with the next iteration
        }

      }
      
    }

    // Calculate the weighted average of the scores
    const scores = responses.map(resp => {
      if (section === 'education') {
        return {
          school_1_score: roundToTwoDecimalPlaces(resp.school_1_score || 0),
          school_2_score: roundToTwoDecimalPlaces(resp.school_2_score || 0),
          undergrad_university_score: roundToTwoDecimalPlaces(resp.undergrad_university_score || 0),
          undergrad_cgpa_score: roundToTwoDecimalPlaces(resp.undergrad_cgpa_score || 0),
          postgrad_university_score: roundToTwoDecimalPlaces(resp.postgrad_university_score || 0),
          postgrad_cgpa_score: roundToTwoDecimalPlaces(resp.postgrad_cgpa_score || 0)
        };
      } else {
        return roundToTwoDecimalPlaces(resp.score || 0);
      }
    });

    if (section === 'education') {
      const finalScore = {
        school_1_score: weightedAverage(scores.map(score => score.school_1_score)),
        school_2_score: weightedAverage(scores.map(score => score.school_2_score)),
        undergrad_university_score: weightedAverage(scores.map(score => score.undergrad_university_score)),
        undergrad_cgpa_score: weightedAverage(scores.map(score => score.undergrad_cgpa_score)),
        postgrad_university_score: weightedAverage(scores.map(score => score.postgrad_university_score)),
        postgrad_cgpa_score: weightedAverage(scores.map(score => score.postgrad_cgpa_score))
      };
      return finalScore;
    } else {
      return weightedAverage(scores);
    }

  };
const calculateScores = async (userId, data) => {
  console.log(`Calculating scores for user ID: ${userId}`);
  const { educationData, internshipsData, workExperienceData, projectsData } = data;

  try {
    const educationScore = getOpenAIScore('education', JSON.stringify(educationData));
    const internshipsScore = getOpenAIScore('internships', JSON.stringify(internshipsData));
    const workExperienceScore = getOpenAIScore('work_experience', JSON.stringify(workExperienceData));
    const projectsScore = getOpenAIScore('projects', JSON.stringify(projectsData));

    const scores = await Promise.all([educationScore, internshipsScore, workExperienceScore, projectsScore]);

    console.log(`Scores calculated for user ID: ${userId}`, scores);
    return {
      education: scores[0],
      internships: scores[1],
      work_experience: scores[2],
      projects: scores[3]
    };
  } catch (error) {
    console.error(`Error calculating scores for user ID: ${userId}`, error);
    throw error;
  }
};

const getWeights = (userType) => {
    console.log(`Fetching weights for user type: ${userType}`);
    const weightages = {
      'Student': {
        education: {
          school_1_weight: 1.0,
          school_2_weight: 1.0,
          undergrad_university_weight: 1.0,
          undergrad_cgpa_weight: 1.0,
          postgrad_university_weight: 1.0,
          postgrad_cgpa_weight: 1.0
        },
        internships: 1.0,
        work_experience: 1.0,
        projects: 1.0
      },
      'Graduate': {
        education: {
            school_1_weight: 1.0,
            school_2_weight: 1.0,
            undergrad_university_weight: 1.0,
            undergrad_cgpa_weight: 1.0,
            postgrad_university_weight: 1.0,
            postgrad_cgpa_weight: 1.0
          },
          internships: 1.0,
          work_experience: 1.0,
          projects: 1.0
      },
      'Post Graduate': {
        education: {
            school_1_weight: 1.0,
            school_2_weight: 1.0,
            undergrad_university_weight: 1.0,
            undergrad_cgpa_weight: 1.0,
            postgrad_university_weight: 1.0,
            postgrad_cgpa_weight: 1.0
          },
          internships: 1.0,
          work_experience: 1.0,
          projects: 1.0
      },
      'Intern': {
        education: {
            school_1_weight: 1.0,
            school_2_weight: 1.0,
            undergrad_university_weight: 1.0,
            undergrad_cgpa_weight: 1.0,
            postgrad_university_weight: 1.0,
            postgrad_cgpa_weight: 1.0
          },
          internships: 1.0,
          work_experience: 1.0,
          projects: 1.0
      },
      'Entry Level Job': {
        education: {
            school_1_weight: 1.0,
            school_2_weight: 1.0,
            undergrad_university_weight: 1.0,
            undergrad_cgpa_weight: 1.0,
            postgrad_university_weight: 1.0,
            postgrad_cgpa_weight: 1.0
          },
          internships: 1.0,
          work_experience: 1.0,
          projects: 1.0
      },
      'Senior Level Job': {
        education: {
            school_1_weight: 1.0,
            school_2_weight: 1.0,
            undergrad_university_weight: 1.0,
            undergrad_cgpa_weight: 1.0,
            postgrad_university_weight: 1.0,
            postgrad_cgpa_weight: 1.0
          },
          internships: 1.0,
          work_experience: 1.0,
          projects: 1.0
      }
    };
  
    const weights = weightages[userType] || {
        education: {
            school_1_weight: 1.0,
            school_2_weight: 1.0,
            undergrad_university_weight: 1.0,
            undergrad_cgpa_weight: 1.0,
            postgrad_university_weight: 1.0,
            postgrad_cgpa_weight: 1.0
          },
          internships: 1.0,
          work_experience: 1.0,
          projects: 1.0
    };
  
    console.log(`Weights for user type ${userType}:`, weights);
    return weights;
  };

  const aggregateScores = (scores, weights) => {
    console.log(`Aggregating scores with weights:`, { scores, weights });
    
    const educationScore = (
      scores.education.school_1_score * weights.education.school_1_weight +
      scores.education.school_2_score * weights.education.school_2_weight +
      scores.education.undergrad_university_score * weights.education.undergrad_university_weight +
      scores.education.undergrad_cgpa_score * weights.education.undergrad_cgpa_weight +
      scores.education.postgrad_university_score * weights.education.postgrad_university_weight +
      scores.education.postgrad_cgpa_score * weights.education.postgrad_cgpa_weight
    );
  
    const finalScore = (
      educationScore +
      scores.internships * weights.internships +
      scores.work_experience * weights.work_experience +
      scores.projects * weights.projects
    );
  
    console.log(`Final aggregated score: ${finalScore}`);
    return roundToTwoDecimalPlaces(finalScore);
  };

  const calculateFinalScore = async (userId, userType, data) => {
    console.log(`Calculating final score for user ID: ${userId}, user type: ${userType}`);
    const scores = await calculateScores(userId, data);
    const weights = getWeights(userType);
  
    const finalScore = aggregateScores(scores, weights);
  
    scores.final = finalScore;
    console.log(`Final scores for user ID ${userId}:`, scores);
    
    // Structure the scores in a way that includes detailed education scores
    const detailedScores = {
      education: {
        school_1_score: scores.education.school_1_score,
        school_2_score: scores.education.school_2_score,
        undergrad_university_score: scores.education.undergrad_university_score,
        undergrad_cgpa_score: scores.education.undergrad_cgpa_score,
        postgrad_university_score: scores.education.postgrad_university_score,
        postgrad_cgpa_score: scores.education.postgrad_cgpa_score
      },
      internships: scores.internships,
      work_experience: scores.work_experience,
      projects: scores.projects,
      final: scores.final
    };
  
    return { scores: detailedScores, weights };
  };
  

module.exports = { calculateFinalScore };