// nodeReactInterview1Prompts.js

const nodeReactInterview1Prompts = {
    "prompts": {
      "Technical Skills": `
        Evaluate the following HR interview transcript for the candidate's technical abilities in Node.js and React.js. 
        Provide a total score out of 50 and flag any indications of potential cheating. 
        Restrict your responses to the provided json format- DO NOT add additional comments outside the JSON.
  
        ### Response Format
        Respond in the following JSON format:
        {
          "total_score": X, // out of 50, summing up individual scores for all 10 questions,
          "cheating_flags": "Any indications of potential cheating",
          "question_scores": [
            {
              "question_id": 1,
              "qualitative_assessment": "Assessment text here",
              "score": Y // Score out of 5
            },
            {
              "question_id": 2,
              "qualitative_assessment": "Assessment text here",
              "score": Y // Score out of 5
            },
            {
              "question_id": 3,
              "qualitative_assessment": "Assessment text here",
              "score": Y // Score out of 5
            },
            {
              "question_id": 4,
              "qualitative_assessment": "Assessment text here",
              "score": Y // Score out of 5
            },
            {
              "question_id": 5,
              "qualitative_assessment": "Assessment text here",
              "score": Y // Score out of 5
            },
            {
              "question_id": 6,
              "qualitative_assessment": "Assessment text here",
              "score": Y // Score out of 5
            },
            {
              "question_id": 7,
              "qualitative_assessment": "Assessment text here",
              "score": Y // Score out of 5
            },
            {
              "question_id": 8,
              "qualitative_assessment": "Assessment text here",
              "score": Y // Score out of 5
            },
            {
              "question_id": 9,
              "qualitative_assessment": "Assessment text here",
              "score": Y // Score out of 5
            },
            {
              "question_id": 10,
              "qualitative_assessment": "Assessment text here",
              "score": Y // Score out of 5
            }
          ]
        }
  
        ### Scoring Criteria
        Assign a total score out of 50 based on the following criteria (5 marks for each question, 10 questions total):
        - Excellent: 5 (Comprehensive, accurate, and specific answer that demonstrates deep understanding and clear articulation)
        - Good: 4 (Mostly accurate answer with minor errors that demonstrates a good understanding)
        - Average: 3 (Basic understanding, but some significant errors or omissions)
        - Below Average: 2 (Limited understanding, many errors, and lacks clarity)
        - Poor: 1 (Minimal understanding, major errors, or confusion)
        - Blank or incomplete response: 0
        - Irrelevant response: 0
  
        ### Additional Guidance
        - If a question is left blank or answered incompletely, assign a score of 0.
        - If the response to a question is irrelevant to the question asked, assign a score of 0.
  
        ### Questions Context
        Node.js Questions: <<NODEJS_QUESTIONS>>
        React.js Questions: <<REACTJS_QUESTIONS>>
        
        ### Reference Responses with scores:
        <<REFERENCE_RESPONSES_WITH_SCORES>>
  
        ### Transcript- responses by candidate:
        <<TRANSCRIPT>>
      `,
  
      "Communication Skills": `
        Evaluate the following HR interview transcript for the candidate's spoken English ability. 
        Provide both a quantitative score and a qualitative assessment. 
        Restrict your responses to the provided json format- DO NOT add additional comments outside the JSON.
  
        ### Response Format
        Respond in the following JSON format:
        {
          "score": X,
          "assessment": {
            "overall_fluency": "Description of fluency",
            "vocabulary_richness": "Description of vocabulary",
            "sentence_structure": "Description of sentence structure",
            "fluency_flags": "Any differences in fluency based on question type",
            "cheating_flags": "Any indications of potential cheating"
          }
        }
  
        ### Scoring Criteria
        Assign a score based on the following scale:
        - Excellent: 5
        - Good: 4
        - Average: 3
        - Below Average: 2
        - Poor: 1
  
        ### Qualitative Assessment
        In addition to the score, provide a qualitative assessment in JSON format. Consider the following aspects:
        - Overall fluency
        - Clarity of speech
        - Vocabulary richness
        - Pronunciation accuracy
        - Sentence structure
  
        ### Specific Flags
        - If you notice any differences in fluency based on the type of questions (e.g., technical vs. conversational), flag that.
        - If you suspect the candidate might be reading out answers to technical questions (indicating potential cheating), flag that as well.
        
        ### Transcript- questions + responses by candidate:
        <<TRANSCRIPT>>
      `,
  
      "personalityTraits": `
        Evaluate the following HR interview transcript for the candidate's personality traits. 
        Provide a detailed assessment based on the specified keywords and criteria. 
        Then, summarize the overall personality of the candidate and assess their fit for a startup culture. 
        Restrict your responses to the provided json format- DO NOT add additional comments outside the JSON.
  
        ### Response Format
        Respond in the following JSON format:
        {
          "assessment": {
            "activity_health": "Description of activity and health-related traits",
            "intellectual_curiosity": "Description of intellectual curiosity and learning",
            "values_ethics": "Description of values and ethics",
            "interpersonal_skills": "Description of interpersonal skills and values",
            "work_ethic": "Description of work ethic and sincerity",
            "integrity": "Description of integrity and ethics",
            "self_motivation": "Description of self-motivation and resourcefulness",
            "other_traits": "Description of other relevant traits like analytical, innovative, creative"
          },
          "good_qualities": "List of highlighted good qualities",
          "red_flags": "List of flagged red flags or concerns",
          "overall_summary": "Summary of overall personality and fit for startup culture"
        }
  
        ### Keywords and Criteria
        - **Activity/Health**: "Passion," "curiosity," "goals," "fulfilment," "exercise," "hiking," "sports"
        - **Intellectual Curiosity**: "Reading," "learning a new skill"
        - **Values/Ethics**: "Volunteering," "spending time with family"
        - **Interpersonal Skills/Values**: "Respect," "collaboration"
        - **Work Ethic/Sincerity**: "Hard work," "dedication"
        - **Integrity/Ethics**: "Transparency," "accountability"
        - **Self-Motivation**: "Self-motivation," "resourcefulness," "proactive," "successful application"
        - **Other Traits**: "Analytical," "innovative," "creative"
  
        ### Detailed Assessment
        Analyze the responses and provide a qualitative assessment for each keyword or category. Consider the following aspects:
        - What the candidate is passionate about
        - Evidence of self-motivation and resourcefulness
        - Indicators of intellectual curiosity and continuous learning
        - Values and ethics, including volunteering and family orientation
        - Interpersonal skills, such as respect and collaboration
        - Work ethic, including hard work and dedication
        - Integrity, such as transparency and accountability
        - Creativity and innovation in problem-solving
  
        ### Specific Flags
        - Highlight really good qualities
        - Flag any red flags or potential concerns
  
        ### Overall Summary
        Based on the detailed assessment, summarize the candidate's overall personality. 
        Assess whether they are a good fit for a startup culture, considering factors like adaptability, 
        willingness to take on challenges, teamwork, and alignment with startup values.
  
        ### Transcript - responses by candidate:
        <<TRANSCRIPT>>
      `,
  
      "logicalReasoning": `
        Evaluate the following Green Energy Case Study transcript for the candidate's analytical, quantitative, and logical skills. 
        Provide a total score out of 50 and flag any indications of potential cheating. 
        Restrict your responses to the provided json format- DO NOT add additional comments outside the JSON.
  
        ### Response Format
        Respond in the following JSON format:
        {
          "total_score": X, // out of 50, summing up individual scores for all 10 questions,
          "cheating_flags": "Any indications of potential cheating",
          "question_scores": [
            {
              "question_id": 1,
              "qualitative_assessment": "Assessment text here",
              "score": Y // Score out of 5
            },
            {
              "question_id": 2,
              "qualitative_assessment": "Assessment text here",
              "score": Y // Score: 0 or 5 (answer should be 22500 kWH, option B, MCQ question)
            },
            {
              "question_id": 3,
              "qualitative_assessment": "Assessment text here",
              "score": Y // Score out of 5
            },
            {
              "question_id": 4,
              "qualitative_assessment": "Assessment text here",
              "score": Y // Score out of 5
            },
            {
              "question_id": 5,
              "qualitative_assessment": "Assessment text here",
              "score": Y // Score out of 5
            },
            {
              "question_id": 6,
              "qualitative_assessment": "Assessment text here",
              "score": Y // Score out of 5
            },
            {
              "question_id": 7,
              "qualitative_assessment": "Assessment text here",
              "score": Y // Score out of 5
            },
            {
              "question_id": 8,
              "qualitative_assessment": "Assessment text here",
              "score": Y // Score out of 5
            },
            {
              "question_id": 9,
              "qualitative_assessment": "Assessment text here",
              "score": Y // Score out of 5
            },
            {
              "question_id": 10,
              "qualitative_assessment": "Assessment text here",
              "score": Y // Score out of 5
            }
          ]
        }
  
        ### Scoring Criteria
        Assign a total score out of 50 based on the following criteria (5 marks for each question, 10 questions total):
        - Excellent: 5 (Comprehensive, accurate, and specific answer that demonstrates deep understanding and clear articulation)
        - Good: 4 (Mostly accurate answer with minor errors that demonstrates a good understanding)
        - Average: 3 (Basic understanding, but some significant errors or omissions)
        - Below Average: 2 (Limited understanding, many errors, and lacks clarity)
        - Poor: 1 (Minimal understanding, major errors, or confusion)
        - Blank or incomplete response: 0
        - Irrelevant response: 0
  
        ### Additional Guidance
        - If a question is left blank or answered incompletely, assign a score of 0.
        - If the response to a question is irrelevant to the question asked, assign a score of 0.
  
        ### Questions Context
        Background Video Script: 
        <<BACKGROUND_VIDEO_SCRIPT>>

        Questions: 
        <<QUESTIONS>>

        ### Reference Responses with scores:
        <<REFERENCE_RESPONSES_WITH_SCORES>>
  
        ### Transcript- responses by candidate:
        <<TRANSCRIPT>>
      `
    }
  };
  
  module.exports = {nodeReactInterview1Prompts};
  