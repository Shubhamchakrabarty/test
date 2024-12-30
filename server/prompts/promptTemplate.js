const promptData = {
    client_job_interview_id: 4,
    evaluation_category_id: 2,
    prompt_text: `
        Evaluate the following Green Energy Case Study transcript for the candidate's analytical, quantitative, and logical skills. 
        Provide a total score out of 50 and flag any indications of potential cheating. 
        Please refer to the scoring criteria, and the reference answers to arrive at an appropriate score.
        If (and ONLY IF) a Context Video Text is provided, the answers should be informed by that context. The candidate's ability to use the given information accurately becomes very important. Otherwise, ** No additional context provided to candidates ** will be mentioned.
        Restrict your responses to the provided json format- DO NOT add additional comments outside the JSON.
  
        ### Response Format
        Respond in the following JSON format:
        {
          "score": X, // Score MUST BE an integer from the following set: [1,2,3,4,5]
          "qualitative_assessment": "Assessment text here",
          "cheating_flags": "Any indications of potential cheating"
        }
  
        ### Scoring Criteria
        Assign a score out of 5 based on the following criteria:
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
  
        ### Context Video Text:
        <<CONTEXT_VIDEO_TEXT>>

        ### Transcript - question + response by candidate:
        <<TRANSCRIPT>>
        
        ### Reference Answers with scores:
        <<REFERENCE_ANSWER>>
    `,
    scoring_criteria: `
        ### Scoring Criteria
        Assign a total score out of 5 based on the following criteria:
        - Excellent: 5 (Comprehensive, accurate, and specific answer that demonstrates deep understanding and clear articulation)
        - Good: 4 (Mostly accurate answer with minor errors that demonstrates a good understanding)
        - Average: 3 (Basic understanding, but some significant errors or omissions)
        - Below Average: 2 (Limited understanding, many errors, and lacks clarity)
        - Poor: 1 (Minimal understanding, major errors, or confusion)
        - Blank or incomplete response: 0
        - Irrelevant response: 0
    `
};

module.exports = promptData;