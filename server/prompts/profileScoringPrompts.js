// prompts/profileScoringPrompts.js

const profileScoringPrompts = {
    "prompts": {
      "education": `
        Evaluate the following education details and provide a JSON response with scores based on the criteria. 
        Restrict your responses to the provided json format- DO NOT add additional comments outside the JSON.
        ### Response Format
        Respond in the following JSON format:
        {
          "reasoning": "Brief explanation of why the scores were assigned.",
          "school_1_score": X, // Score out of 10
          "school_2_score": X, // Score out of 10
          "undergrad_university_score": X, // Score out of 10
          "undergrad_cgpa_score": X, // Score out of 10
          "postgrad_university_score": X, // Score out of 10
          "postgrad_cgpa_score": X // Score out of 10
        }

        ### Scoring Criteria:
        1. School 1: CGPA score scaled out of 10, if no CGPA, then 5, if no school entries, then zero.
        2. School 2: same as School 1, zero if there is only one school entry.
        3. University - Undergrad: score out of 10 based on type of university (Tier 1: 10, Tier 2: 8, Tier 3: 6, Others: 4).
        4. Undergrad CGPA: scaled to 10.
        5. University - Postgrad: score out of 10 based on type of university (Tier 1: 10, Tier 2: 8, Tier 3: 6, Others: 4).
        6. Postgrad CGPA: scaled to 10.

        ### Education details: 
        <<content>>
      `,
      "internships": `
        Evaluate the following internship details and provide a JSON response with a score out of 10 based on the quality and number of internships. 
        Restrict your responses to the provided json format- DO NOT add additional comments outside the JSON.

        ### Response Format
        Respond in the following JSON format:
        {
            "reasoning": "Brief explanation of why the score was assigned.",
            "score": X // Score out of 10
        }

        ### Scoring Criteria:
        - Multiple High-Quality Internships: 10
        - One High-Quality Internship: 8
        - Multiple Internships (Mixed Quality): 6
        - One Internship: 4
        - None: 0

        ### Internship details: 
        <<content>>
      `,
      "work_experience": `
        Evaluate the following work experience details and provide a JSON response with a score out of 10 based on the relevance and duration of job experience.
        Restrict your responses to the provided json format- DO NOT add additional comments outside the JSON.

        ### Response Format
        Respond in the following JSON format:
        {
            "reasoning": "Brief explanation of why the score was assigned.",
            "score": X // Score out of 10
        }

        ### Scoring Criteria:
        - 3 years: 10
        - 2-3 years: 8
        - 1-2 years: 6
        - < 1 year: 4
        - None: 0
        
        ### Work Experience details:
        <<content>>
      `,
      "projects": `
        Evaluate the following project details and provide a JSON response with a score out of 10 based on the number and quality of projects.
        Restrict your responses to the provided json format- DO NOT add additional comments outside the JSON.

        ### Response Format
        Respond in the following JSON format:
        {
            "reasoning": "Brief explanation of why the score was assigned.",
            "score": X // Score out of 10
        }


        ### Scoring Criteria:
        - Outstanding Projects: 10
        - Good Projects: 8
        - Average Projects: 6
        - Few/Low Quality Projects: 4
        - None: 0
        
        ### Project details:
        <<content>>
      `
    }
  };
  
  module.exports = { profileScoringPrompts };
  