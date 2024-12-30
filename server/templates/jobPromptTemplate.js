// jobPromptTemplate.js

const jobPromptTemplate = {
  prompts: [
    {
      client_job_interview_id: 112,  // Technical Financial Interview
      evaluation_category_id: 5,     // Functional Skills                   (5 for dev, 3 for prod)
      prompt_text: `
        Evaluate the candidate's functional skills during the Technical Financial Assessment Interview.
        Focus on their ability to conduct market research, analyze financial data, and create comprehensive reports, as well as their ability to collaborate effectively with senior investment professionals, specially for startup investments.
        Provide a quantitative score and a qualitative assessment of how well they demonstrate attention to detail, research skills, financial conceptual knowledge, and decision-making abilities.
        Reference answers are provided to serve as benchmarks for what constitutes a high-quality response.
        The candidate should not be penalized for approaching the answer differently, provided the financial concepts and analysis are reasonable.
        Please refer to the scoring criteria and the reference answers to arrive at an appropriate score.
        Restrict your responses to the provided JSON format—DO NOT add additional comments outside the JSON.

        ### Response Format
        Respond in the following JSON format:
        {
          "score": X, // Score MUST BE an integer from the following set: [1,2,3,4,5]
          "qualitative_assessment": {
              "feedback_summary": "Explain your reasoning for the score provided. Use the reference answers and the scoring criteria as a quality and score benchmark, without explicitly quoting the reference answers in your reasoning."
          }
        }
    
        ### Scoring Criteria
        Assign a score based on the following criteria:
        - Excellent: 5 (Comprehensive, detailed understanding of financial concepts, clear and well-reasoned analysis, and strategic recommendations)
        - Good: 4 (Mostly accurate and well-structured analysis with minor gaps, strong financial understanding and decision-making)
        - Average: 3 (Adequate understanding of financial concepts but with noticeable gaps, weaker analytical or decision-making skills)
        - Below Average: 2 (Limited understanding of financial concepts or strategic decision-making, lacks clarity in analysis and recommendations)
        - Poor: 1 (Minimal understanding or major errors in financial analysis, lacks strategic thought)
        - Blank or incomplete response: 0
        - Irrelevant response: 0
    
        ### Qualitative Assessment
        Provide a qualitative assessment of how well the candidate demonstrates functional skills. Consider the following aspects:
        - Financial Concepts Understanding: Did the candidate demonstrate a clear understanding of key financial principles and how to apply them?
        - Valuation and Analysis: Did the candidate show an ability to evaluate company valuations and analyze financial data?
        - Strategic Decision-Making: Did the candidate make sound and strategic investment recommendations based on available data?
        - Overall Summary: Summarize the overall performance of the candidate in terms of their suitability for the Investment Analyst role.
        

        ### Transcript - questions + responses by candidate:
        <<TRANSCRIPT>>

        ### Reference Answers with scores:
        <<REFERENCE_ANSWER>>
      `,
      scoring_criteria: `
        ### Scoring Criteria
        Assign a score based on the following criteria:
        - Excellent: 5 (Comprehensive, detailed understanding of financial concepts, clear and well-reasoned analysis, and strategic recommendations)
        - Good: 4 (Mostly accurate and well-structured analysis with minor gaps, strong financial understanding and decision-making)
        - Average: 3 (Adequate understanding of financial concepts but with noticeable gaps, weaker analytical or decision-making skills)
        - Below Average: 2 (Limited understanding of financial concepts or strategic decision-making, lacks clarity in analysis and recommendations)
        - Poor: 1 (Minimal understanding or major errors in financial analysis, lacks strategic thought)
        - Blank or incomplete response: 0
        - Irrelevant response: 0
      `
    },
    {
      client_job_interview_id: 113,  // Personality Assessment
      evaluation_category_id: 3,     // Communication Skills       (3 for dev, 1 for prod)
      prompt_text: `
        Evaluate the following interview transcript for the candidate's ability to effectively explain financial concepts in English, particularly in the context of their role as a Financial Analyst. The evaluation should focus on how clear, concise, and accurate their explanations are, as well as their ability to convey complex financial information in a professional and understandable manner to both financial experts and non-experts.

        ### Response Format
        Restrict your response to the following JSON format—DO NOT add additional comments outside the JSON.
        Respond in the following JSON format:
        {
          "score": X, // Score MUST BE an integer from the following set: [1,2,3,4,5]
          "qualitative_assessment": {
              "message_clarity": "Description of how clearly and effectively the candidate communicates financial concepts and analysis",
              "professional_tone": "Description of how professional the candidate sounds, considering workplace context",
              "conciseness": "Description of whether the candidate was concise and to the point"
          }
        }

        ### Scoring Criteria
        Assign a score based on the following scale:
        - Excellent: 5 (Highly effective communication, professional tone, concise, message is clear and well-understood, candidate demonstrates effectiveness in communicating complex financial concepts and strategies within a VC firm)
        - Good: 4 (Mostly effective communication, professional, relatively concise, minor issues with clarity or depth, but candidate generally communicates effectively in a VC setting)
        - Average: 3 (Moderately clear communication, some issues with professionalism or conciseness, message lacks detail or precision, and effectiveness in conveying financial or strategic insights to partners or investors)
        - Below Average: 2 (Lacks clarity or professionalism, verbose, message is difficult to understand, limited attention to detail or effectiveness in explaining financial data or strategy)
        - Poor: 1 (Minimal effectiveness, unclear or unprofessional, message is poorly conveyed, lacks attention to detail or effectiveness in communicating within a financial VC firm)
        
        ### Qualitative Assessment
        In addition to the score, provide a qualitative assessment in JSON format. Consider the following aspects:
        - Message Clarity: How well does the candidate communicate their intended message, particularly around financial data, investment strategies, or portfolio updates? Is their communication clear when presenting to partners or stakeholders?
        - Professional Tone: Is the tone appropriate for communication within a VC firm? Does the candidate convey professionalism when interacting with colleagues, investors, or portfolio companies?
        - Conciseness: Is the candidate able to convey their message without unnecessary elaboration, especially when discussing complex financial or strategic topics in meetings or reports?
        

        ### Transcript - questions + responses by candidate:
        <<TRANSCRIPT>>
      `,
      scoring_criteria: `
        ### Scoring Criteria
        Assign a score based on the following scale:
        - Excellent: 5 (Highly effective communication, professional tone, concise, message is clear and well-understood, candidate demonstrates effectiveness in communicating complex financial concepts and strategies within a VC firm)
        - Good: 4 (Mostly effective communication, professional, relatively concise, minor issues with clarity or depth, but candidate generally communicates effectively in a VC setting)
        - Average: 3 (Moderately clear communication, some issues with professionalism or conciseness, message lacks detail or precision, and effectiveness in conveying financial or strategic insights to partners or investors)
        - Below Average: 2 (Lacks clarity or professionalism, verbose, message is difficult to understand, limited attention to detail or effectiveness in explaining financial data or strategy)
        - Poor: 1 (Minimal effectiveness, unclear or unprofessional, message is poorly conveyed, lacks attention to detail or effectiveness in communicating within a financial VC firm)
      `
    },
    {
      client_job_interview_id: 113,  // Personality Assessment
      evaluation_category_id: 4,     // Personality Traits          (4 for dev, 4 for prod)
      prompt_text: `
        Evaluate the following interview transcript for the candidate's ability to effectively multitask, handle pressure, and communicate their intended message in English. The evaluation should focus on how well the candidate demonstrates the ability to manage multiple tasks under pressure while maintaining professionalism.

        ### Response Format
        Restrict your response to the following JSON format—DO NOT add additional comments outside the JSON. 
        Respond in the following JSON format: 
        {
           "score": X, // Score MUST BE an integer from the following set: [1,2,3,4,5] 
           "qualitative_assessment": { 
            "multitasking_ability": "Description of the candidate's ability to manage and prioritize multiple tasks effectively", 
            "dealing_with_pressure": "Description of how well the candidate handles high-pressure situations while communicating clearly",
          } 
        }
        
        ### Scoring Criteria
        Assign a score based on the following scale:
        - Excellent: 5 (Highly effective in multitasking, handling pressure, professional tone, clear and concise message)
        - Good: 4 (Mostly effective in multitasking, handles pressure well, professional, relatively clear and concise)
        - Average: 3 (Moderate ability to multitask, handles pressure adequately, but has some issues with clarity or professionalism)
        - Below Average: 2 (Struggles to multitask, has difficulty managing pressure, unclear communication or lacks professionalism)
        - Poor: 1 (Minimal effectiveness in multitasking, handling pressure, unclear or unprofessional communication)
        
        
        ### Qualitative Assessment
        In addition to the score, provide a qualitative assessment in JSON format. Consider the following aspects:
        - Multitasking Ability: How well does the candidate manage and prioritize multiple tasks? Do they demonstrate efficiency when handling several tasks at once?
        - Dealing with Pressure: Does the candidate stay calm and communicate effectively under pressure? Are they able to manage stress while conveying their message?
          ### Transcript - questions + responses by candidate:
          <<TRANSCRIPT>>
      `,
      scoring_criteria: `
        ### Scoring Criteria
        Assign a score based on the following scale:
        - Excellent: 5 (Highly effective in multitasking, handling pressure, professional tone, clear and concise message)
        - Good: 4 (Mostly effective in multitasking, handles pressure well, professional, relatively clear and concise)
        - Average: 3 (Moderate ability to multitask, handles pressure adequately, but has some issues with clarity or professionalism)
        - Below Average: 2 (Struggles to multitask, has difficulty managing pressure, unclear communication or lacks professionalism)
        - Poor: 1 (Minimal effectiveness in multitasking, handling pressure, unclear or unprofessional communication)
      `
    }   
  ]
};

module.exports = { jobPromptTemplate };
