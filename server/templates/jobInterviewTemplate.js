const jobInterviewTemplate = {
  "ClientJob": {
    "client_user_id": 21,
    "job_title": "Full Stack Engineer Intern",
    "job_description": `
      Should possess strong knowledge of programming fundamentals
      Knowledge of MERN stack, postgresql 
      Product development mindset- should be curious about WHY we build specific features- should care about the business impact of building software.
      Self learner, problem solver, proactive worker
      `,
    "status": "Open"
  },
  "Interviews": [
    {
      "interview_name": "Problem Solving and Culture-Fit Test",
      "interview_time_limit": 750,
      "time_limit_per_answer": 150,
      "status": "Published",
      "pre_interview_instructions": {
      "pre_interview_instructions": "Please speak clearly into your phone or laptop's microphone.",
      "welcome_message": "Welcome to Round 1 of our interview process. We wish you all the best!",
      "welcome_video_url": "https://player.vimeo.com/video/1012336137",
      "context_video_url": null,
      "context_video_text": null
    },
      "Questions": [
        {
          "question_text": "Tell us about yourself, What are your biggest strengths and worst weakanesses? What irriates you the most in your day to day life? What excites you the most ?",
          "question_type": "Video",
          "media_url": "https://player.vimeo.com/video/1011535173",
          "text_instructions": "to check your strengths and weaknesses",
          "question_order": 1,
          "reference_answers": [
            {
              "evaluation_category_id": 5,
              "answers": [
                { "score": 5, "answer": "Structure: The candidate gives a concise, well-organized introduction, highlighting relevant professional and personal background. They clearly articulate their strengths, focusing on those that align with the role. They discuss weaknesses with self-awareness, providing specific examples and a plan for improvement. They describe irritants professionally, framing them as manageable challenges, and link excitements to the role and personal growth. Content: The strengths are supported by concrete examples, showing impact. Weaknesses are genuine, and steps for improvement are clear and actionable. Irritants are minor and handled constructively. Excitements are clearly linked to career goals or passions relevant to the role. Delivery: Confident, positive, and engaging, with a professional tone throughout. The candidate maintains eye contact, and the response is well-paced, showing enthusiasm and self-awareness." },
                { "score": 4, "answer": "Structure: The response is well-organized but may miss some flow between sections. The candidate discusses strengths and weaknesses effectively but might not fully connect them to the role. Content: Strengths are mostly relevant, though examples may be less detailed. Weaknesses are acknowledged, but the improvement plan is not as strong. Irritants are described appropriately but could be more professionally framed. Excitements are relevant but lack depth. Delivery: Good overall, with clear and professional communication. The candidate shows confidence but may be less engaging or dynamic." },
                { "score": 3, "answer": "Structure: Some organization, but transitions between sections are unclear. The candidate provides basic details about themselves but lacks a cohesive narrative. Content: Strengths and weaknesses are described, but without specific examples. The weaknesses might be downplayed or presented as disguised strengths. Irritants may be too personal or lack professional context. Excitements are discussed but not linked to the role or career goals. Delivery: Average delivery with some hesitations or lack of clarity. The candidate may seem less confident or enthusiastic." },
                { "score": 2, "answer": "Structure: The response is disorganized, jumping between points without a clear structure. The candidate may struggle to articulate a coherent narrative about themselves. Content: Strengths and weaknesses are vague or generic, lacking relevance to the role. Weaknesses might be avoided or presented unprofessionally. Irritants could come across as complaints, and excitements may not relate to the role or personal development. Delivery: The candidate appears uncertain or unfocused, with unclear or rambling responses. Lack of engagement or professionalism is evident." },
                { "score": 1, "answer": "Structure: No clear structure; the candidate provides a scattered and unfocused response. Points may be unrelated or contradictory. Content: Strengths and weaknesses are poorly articulated, irrelevant, or inappropriate. The candidate may avoid discussing weaknesses or provide a non-answer. Irritants are presented negatively, and excitements are unrelated to the role or are absent. Delivery: The candidate appears unprepared, nervous, or dismissive. The response lacks coherence, and there is little to no engagement or professionalism." }
              ]
            }
          ]
        },
        {
          "question_text": "Imagine you're part of a student group organizing a major event, and on the day of the event, half of the volunteers don't show up. How would you handle the situation to ensure that the event still runs smoothly?",
          "question_type": "Video",
          "media_url": "https://player.vimeo.com/video/1011535191",
          "text_instructions": "to evaluate resourcefulness, decision making under pressure",
          "question_order": 2,
          "reference_answers": [
            {
              "evaluation_category_id": 5,
              "answers": [
                { "score": 5, "answer": "Problem-Solving: Takes immediate action to reassign tasks, prioritizes critical activities, and maintains calm under pressure. Team Management: Engages remaining volunteers, clearly communicates new roles, and keeps morale high. Resourcefulness: Looks for additional help if needed, adapts the event schedule if possible, and focuses on delivering the most important outcomes. Outcome-Oriented: Provides examples of similar past experiences or demonstrates effective crisis management strategies." },
                { "score": 4, "answer": "Problem-Solving: Identifies key tasks and reallocates resources effectively but might miss some contingency plans. Team Management: Good engagement with volunteers, but morale-boosting efforts could be stronger. Resourcefulness: Proposes some alternative solutions but may lack innovation. Outcome-Oriented: Solid response but lacks a compelling example or evidence of past experience." },
                { "score": 3, "answer": "Problem-Solving: Basic approach to handling the issue, may overlook prioritization. Team Management: Some engagement but lacks effective communication strategy. Resourcefulness: Limited suggestions, might overlook potential external resources. Outcome-Oriented: Average response, lacks depth or actionable steps." },
                { "score": 2, "answer": "Problem-Solving: Struggles to identify priorities, unclear steps. Team Management: Poor engagement, vague directions to volunteers. Resourcefulness: Little creativity in problem-solving. Outcome-Oriented: Weak response, lacks direction and effectiveness." },
                { "score": 1, "answer": "Problem-Solving: Panics or fails to address key issues. Team Management: Poor or no communication, creates confusion. Resourcefulness: No alternative solutions proposed. Outcome-Oriented: Unfocused response, no effective plan." }
              ]
            }
          ]
        },
        {
          "question_text": "You’ve been working on a group project, and a key team member drops out, leaving their portion incomplete. What would you do to make sure the project is still finished on time?",
          "question_type": "Video",
          "media_url": "https://player.vimeo.com/video/1011535204",
          "text_instructions": "to evaluate hard working ability",
          "question_order": 3,
          "reference_answers": [
            {
              "evaluation_category_id": 5,
              "answers": [
                { "score": 5, "answer": "Adaptability: Quickly assesses the incomplete work and redistributes tasks among remaining members. Leadership: Takes initiative to fill the gap, either by taking on additional work or finding external help. Communication: Clearly communicates changes to team and manages expectations. Outcome-Oriented: Provides a concrete plan to complete the project on time, citing examples of past experience." },
                { "score": 4, "answer": "Adaptability: Responds well but may not fully address all aspects of the missing work. Leadership: Takes initiative but may lack some strategic thinking in task redistribution. Communication: Effective but could be more proactive in managing team morale. Outcome-Oriented: Good response, but lacking a specific past example." },
                { "score": 3, "answer": "Adaptability: Basic response to handling additional workload. Leadership: Steps up but may lack clear strategy or initiative. Communication: Addresses the team but lacks clarity or effectiveness. Outcome-Oriented: Provides a basic plan but not fully thought-out." },
                { "score": 2, "answer": "Adaptability: Struggles to reassign tasks effectively. Leadership: Limited or no initiative, unclear plan. Communication: Poor or unclear communication, creates confusion. Outcome-Oriented: Ineffective response, lacks a clear plan." },
                { "score": 1, "answer": "Adaptability: Fails to address the issue, suggests giving up or postponing the project. Leadership: No initiative or ownership of the problem. Communication: Fails to communicate effectively, creates further issues. Outcome-Oriented: No actionable plan or ineffective solution." }
              ]
            }
          ]
        },
        {
          "question_text": "You’re working on a team project, and you notice early on that your team is falling behind schedule. No one else has noticed this yet. the main reason is that all group members work from their homes and it hampers co ordination. What steps would you take to get the team back on track?",
          "question_type": "Video",
          "media_url": "https://player.vimeo.com/video/1011535224",
          "text_instructions": "to evaluate proactiveness ",
          "question_order": 4,
          "reference_answers": [
            {
              "evaluation_category_id": 5,
              "answers": [
                { "score": 5, "answer": "Proactivity: Immediately suggests implementing structured communication channels (e.g., daily stand-ups). Problem-Solving: Proposes solutions like task management tools, periodic syncs, or designated leaders. Leadership: Takes charge in organizing a team meeting to discuss and align on strategies. Adaptability: Offers to lead a subgroup or coordinate efforts to ensure timely delivery." },
                { "score": 4, "answer": "Proactivity: Identifies the issue early but may not suggest comprehensive solutions. Problem-Solving: Proposes basic solutions, such as more frequent check-ins. Leadership: Takes some initiative but could be more proactive in engaging the team. Adaptability: Responds well but lacks full implementation of solutions." },
                { "score": 3, "answer": "Proactivity: Recognizes the issue but response may be delayed. Problem-Solving: Suggests minimal solutions or overlooks some key points. Leadership: Some initiative but lacks clear direction or strategy. Adaptability: Limited in offering concrete steps to improve coordination." },
                { "score": 2, "answer": "Proactivity: Slow to react or lacks awareness of the issue. Problem-Solving: Proposes vague or ineffective solutions. Leadership: Limited initiative, unclear direction. Adaptability: Struggles to provide a clear plan." },
                { "score": 1, "answer": "Proactivity: Does not recognize the issue or ignores it. Problem-Solving: No solutions proposed, suggests defeat or postponement. Leadership: No leadership shown, avoids responsibility. Adaptability: Fails to adapt or suggest any improvement." }
              ]
            }
          ]
        },
        {
          "question_text": "You hear about an opportunity for an internship or side project, but you don’t feel fully qualified. How would you approach applying for it or learning what’s needed to take on the challenge?",
          "question_type": "Video",
          "media_url": "https://player.vimeo.com/video/1011535239",
          "text_instructions": "To assess competitive analysis and strategic adjustment skills.",
          "question_order": 5,
          "reference_answers": [
            {
              "evaluation_category_id": 5,
              "answers": [
                { "score": 5, "answer": "Growth Mindset: Shows a proactive attitude, emphasizes learning and growth. Outlines a clear plan for acquiring necessary skills. Resourcefulness: Mentions using resources like online courses, mentors, or networking. Confidence: Shows a willingness to take on challenges and learn on the job. Examples: Provides a past experience of overcoming a similar situation." },
                { "score": 4, "answer": "Growth Mindset: Proactive but lacks a fully detailed learning plan. Resourcefulness: Mentions some resources but could be more specific. Confidence: Confident but may show some hesitation. Examples: Good response but lacks a strong example." },
                { "score": 3, "answer": "Growth Mindset: Willing to learn but lacks clear steps or plan. Resourcefulness: Basic suggestions, not very specific. Confidence: Some uncertainty in taking on new challenges. Examples: Average, lacks depth or past experiences." },
                { "score": 2, "answer": "Growth Mindset: Willing to try but lacks a clear learning plan. Resourcefulness: Vague suggestions like I'll try to learn. Confidence: Uncertain about abilities, hesitant. Examples: No relevant past experiences or clear steps." },
                { "score": 1, "answer": "Growth Mindset: Reluctant to apply, no plan for improvement. Resourcefulness: No strategies mentioned, uninterested in learning. Confidence: Lacks confidence and motivation, avoids challenge. Examples: No examples or actionable steps provided." }
              ]
            }
          ]
        }
      ],
      "EvaluationCriteria": [
        {
          "evaluation_category_id": 5,
          "priority": 1,
          "instructions": "Assess the candidate's ability to analyze problems and provide effective solutions."
        },
        {
          "evaluation_category_id": 4,
          "priority": 2,
          "instructions": "Qualitative Assessment of candidate's personality and quantitative assessment of overall role-fit."
        },
        {
          "evaluation_category_id": 1,
          "priority": 3,
          "instructions": "Evaluate the clarity, coherence, and effectiveness of the candidate's communication during the interview."
        }

      ]
    },
    {
      "interview_name": "Tech Skills",
      "interview_time_limit": 1500,
      "time_limit_per_answer": 150,
      "status": "Published",
      "pre_interview_instructions": {
      "pre_interview_instructions": `Case Study: Task Management API with Error Handling
      You are developing a RESTful API for a task management application using the React, Node.js, postgresql, express js. The API allows users to create, read, update, and delete tasks. Your focus is on implementing robust error handling mechanisms throughout the application. Following are scenarios that illustrate common situations developers may encounter, along with questions to assess understanding and problem-solving skills..`,
      "welcome_message": "Welcome to Round 2 of our interview process. We wish you all the best!",
      "welcome_video_url": null,
      "context_video_url": null,
      "context_video_text": null
    },
      "Questions": [
        {
          "question_text": `Retrieving a Task by ID
          javascript
          // Function to retrieve a task by ID
          exports.getTaskById = async (req, res) => {
            try {
              const task = await Task.findById(req.params.id);
              if (!task) {
                return res.status(404).json({ error: 'Task not found' });
              }
              res.json(task);
            } catch (error) {
              res.status(500).json({ error: 'Internal server error' });
            }
          };
          What is the purpose of the findById method used in the code snippet?`,
          "question_type": "Video",
          "media_url": "https://player.vimeo.com/video/1010435185",
          "text_instructions": "to evaluate practical tech knowledge",
          "question_order": 1,
          "reference_answers": [
            {
              "evaluation_category_id": 6,
              "answers": [
                { "score": 5, "answer": `Explanation: The findById method is used to query the database and retrieve a specific document/object by its unique ID. It searches for the document/object in the Task collection where the _id field matches the given req.params.id. If the document/object is found, it returns it; otherwise, it returns null. This is typically used for fetching a single resource by its identifier.
                Correct Answer: Provides a detailed explanation, describing what findById does and how it works within the context of the code.` },
                { "score": 4, "answer": `Explanation: The findById method searches for a document/object in the Task collection by its ID and returns it. If the document/object is not found, it returns null.
                Correct Answer: Correct but lacks details on how it is used in the code, such as its role in handling errors or returning responses.` },
                { "score": 3, "answer": `Explanation: The method is used to find a task in the database by its ID.
                Incorrect Answer: Basic understanding but lacks specifics on how findById operates or what it returns.` },
                { "score": 2, "answer": `Explanation: It retrieves information from the database.
                Incorrect Answer: Vague and lacks mention of the ID-based search or what happens if the task is not found.` },
                { "score": 1, "answer": `Explanation: It finds something in the code or gets data.
                Incorrect Answer: Very vague and shows no understanding of what findById does or its purpose in the code.` }
              ]
            }
          ]
        },
        {
          "question_text": `Retrieving a Task by ID
          javascript
          // Function to retrieve a task by ID
          exports.getTaskById = async (req, res) => {
            try {
              const task = await Task.findById(req.params.id);
              if (!task) {
                return res.status(404).json({ error: 'Task not found' });
              }
              res.json(task);
            } catch (error) {
              res.status(500).json({ error: 'Internal server error' });
            }
          };
          How does the code handle the case where the task ID provided does not match any existing tasks in the database?`,
          "question_type": "Video",
          "media_url": "https://player.vimeo.com/video/1010435204",
          "text_instructions": "to evaluate practical tech knowledge",
          "question_order": 2,
          "reference_answers": [
            {
              "evaluation_category_id": 6,
              "answers": [
                { "score": 5, "answer": `Explanation: The code uses the findById method to search for a task by its ID. If no task is found (task is null), it returns a 404 status with a JSON response { error: 'Task not found' }. This indicates to the client that the requested task does not exist in the database.
                Correct Answer: Provides a clear and accurate explanation, describing the exact flow of the code and the use of status code 404 for not found.` },
                { "score": 4, "answer": `Explanation: If no task is found, the code sends a 404 response with an error message saying the task is not found.
                Correct Answer: Correct, but lacks a detailed explanation of how task is evaluated and doesn’t explicitly mention the findById method or what it returns.` },
                { "score": 3, "answer": `Explanation: It checks if the task exists and sends an error message if it doesn’t.
                Incorrect Answer: Shows a basic understanding but lacks details on the 404 status code and the structure of the error response.`},
                { "score": 2, "answer": `Explanation: The code sends an error if the task is not found.
                Incorrect Answer: Vague and doesn’t specify the 404 status code or explain how the absence of the task is handled.` },
                { "score": 1, "answer": `Explanation: It shows an error if something is wrong.
                Incorrect Answer: Very vague, with no mention of how the specific case of a missing task is handled or what the error response is.` }
              ]
            }
          ]
        },
        {
          "question_text": `Creating a New Task
          // Function to create a new task
          exports.createTask = async (req, res) => {
            try {
              const { title, description, dueDate } = req.body;
              if (!title || !description || !dueDate) {
                return res.status(400).json({ error: 'Missing required fields' });
              }
              const task = new Task({ title, description, dueDate });
              await task.save();
              res.status(201).json(task);
            } catch (error) {
              res.status(500).json({ error: 'Internal server error' });
            }
          };
          How does the code validate the incoming request data to ensure it meets the required format and constraints?`,
          "question_type": "Video",
          "media_url": "https://player.vimeo.com/video/1010435228",
          "text_instructions": "to evaluate practical tech knowledge",
          "question_order": 3,
          "reference_answers": [
            {
              "evaluation_category_id": 6,
              "answers": [
                { "score": 5, "answer": `Explanation: The code checks for the presence of title, description, and dueDate fields in the request body. If any of these fields are missing, it responds with a 400 status code and an error message, { error: 'Missing required fields' }. This ensures that all required fields are provided before creating a new task.
                Correct Answer: Accurately describes the validation process, including what fields are required and the use of the 400 status code for missing data.` },
                { "score": 4, "answer": `Explanation: The code checks if title, description, and dueDate are present. If not, it sends a 400 response with an error message.
                Correct Answer: Correct but lacks detail on how the fields are validated (e.g., mentioning that it only checks for presence).` },
                { "score": 3, "answer": `Explanation: It checks for some required fields in the request and sends an error if any are missing.
                Incorrect Answer: Basic understanding, but it’s not clear which fields are required or how the error response is structured.` },
                { "score": 2, "answer": `Explanation: It checks the request body and returns an error if something is missing.
                Incorrect Answer: Vague, lacks details on what specific fields are checked and what the error message is.` },
                { "score": 1, "answer": `Explanation: It tries to create a task and shows an error if it doesn’t work.
                Incorrect Answer: Completely misses the point of data validation and provides no relevant information on how the code checks for required fields.` }
              ]
            }
          ]
        },
        {
          "question_text": `Creating a New Task
          // Function to create a new task
          exports.createTask = async (req, res) => {
            try {
              const { title, description, dueDate } = req.body;
              if (!title || !description || !dueDate) {
                return res.status(400).json({ error: 'Missing required fields' });
              }
              const task = new Task({ title, description, dueDate });
              await task.save();
              res.status(201).json(task);
            } catch (error) {
              res.status(500).json({ error: 'Internal server error' });
            }
          };
          What specific error message is returned if the input data is missing required fields?`,
          "question_type": "Video",
          "media_url": "https://player.vimeo.com/video/1010435247",
          "text_instructions": "to evaluate practical tech knowledge",
          "question_order": 4,
          "reference_answers": [
            {
              "evaluation_category_id": 6,
              "answers": [
                { "score": 5, "answer": `Explanation: The error message returned is { error: 'Missing required fields' } with a 400 status code. This message is sent when any of the required fields (title, description, or dueDate) is not provided in the request body.
                Correct Answer: Accurately states the exact error message and the condition under which it is returned, along with the corresponding status code.` },
                { "score": 4, "answer": `Explanation: The error message returned is ‘Missing required fields’ with a 400 status code if title, description, or dueDate is not present in the request body.
                Correct Answer: Correct message and condition but does not mention the exact structure of the JSON response.` },
                { "score": 3, "answer": `Explanation: It returns an error saying ‘Missing required fields’ when the required fields are not provided.
                Incorrect Answer: Understands the error message but does not mention the status code or explain which fields are required.` },
                { "score": 2, "answer": `Explanation: It shows an error if any fields are missing, like ‘Required fields missing.’
                Incorrect Answer: Vague and does not provide the exact error message or status code.` },
                { "score": 1, "answer": `Explanation: It sends an error when something is wrong with the data.
                Incorrect Answer: Completely misses the specific error message and the context of when it is returned.` }
              ]
            }
          ]
        },
        {
          "question_text": `Updating an Existing Task
          // Function to update a task
          exports.updateTask = async (req, res) => {
            try {
              const task = await Task.findByIdAndUpdate(
                req.params.id,
                { $set: req.body },
                { new: true, runValidators: true }
              );
              if (!task) {
                return res.status(404).json({ error: 'Task not found' });
              }
              res.json(task);
            } catch (error) {
              if (error.name === 'ValidationError') {
                return res.status(400).json({ error: error.message });
              }
              res.status(500).json({ error: 'Internal server error' });
            }
          };
          How does the code handle the situation where the task to be updated does not exist?`,
          "question_type": "Video",
          "media_url": "https://player.vimeo.com/video/1010435260",
          "text_instructions": "to evaluate practical tech knowledge",
          "question_order": 5,
          "reference_answers": [
            {
              "evaluation_category_id": 6,
              "answers": [
                { "score": 5, "answer": `Explanation: If the task does not exist, the findByIdAndUpdate method returns null. The code checks for this condition and sends a 404 status code with the JSON response { error: 'Task not found' }. This informs the client that the specified task ID does not correspond to any existing task in the database.
                Correct Answer: Provides a complete explanation of how the absence of the task is detected and the appropriate response sent back to the client.` },
                { "score": 4, "answer": `Explanation: If the task is not found, the code sends a 404 response with an error message saying 'Task not found'.
                Correct Answer: Correct but does not fully describe how findByIdAndUpdate returning null triggers the error response.` },
                { "score": 3, "answer": `Explanation: It checks if the task is found and sends an error message if it isn’t.
                Incorrect Answer: Understands the basic logic but lacks details on the specific error response and status code.` },
                { "score": 2, "answer": `Explanation: It checks if the task is found and sends an error message if it isn’t.
                Incorrect Answer: Understands the basic logic but lacks details on the specific error response and status code.` },
                { "score": 1, "answer": `Explanation: It sends an error if something is wrong or the update fails.
                Incorrect Answer: Shows no understanding of the specific handling of a non-existent task and does not provide relevant information.` }
              ]
            }
          ]
        },
        {
          "question_text": `Updating an Existing Task
          // Function to update a task
          exports.updateTask = async (req, res) => {
            try {
              const task = await Task.findByIdAndUpdate(
                req.params.id,
                { $set: req.body },
                { new: true, runValidators: true }
              );
              if (!task) {
                return res.status(404).json({ error: 'Task not found' });
              }
              res.json(task);
            } catch (error) {
              if (error.name === 'ValidationError') {
                return res.status(400).json({ error: error.message });
              }
              res.status(500).json({ error: 'Internal server error' });
            }
          };
          How does the code handle validation errors that occur during the update process?`,
          "question_type": "Video",
          "media_url": "https://player.vimeo.com/video/1010435279",
          "text_instructions": "to evaluate practical tech knowledge",
          "question_order": 6,
          "reference_answers": [
            {
              "evaluation_category_id": 6,
              "answers": [
                { "score": 5, "answer": `Explanation: The code checks if the error caught in the catch block has a name property equal to 'ValidationError'. If so, it sends a 400 status code with a JSON response containing the error message: { error: error.message }. This ensures that the client is informed of any validation issues that occur when updating the task.
                Correct Answer: Provides a complete explanation of the error handling mechanism, specifying the type of error and the corresponding response.` },
                { "score": 4, "answer": `Explanation: If a validation error occurs, the code sends a 400 status response with the error message from the validation.
                Correct Answer: Correct, but does not fully describe how the error is identified using the error.name property.` },
                { "score": 3, "answer": `Explanation: It checks for validation errors and sends an error message if there’s a problem with the data.
                Incorrect Answer: Basic understanding of the validation process, but lacks details on how the error is specifically handled and the status code returned.` },
                { "score": 2, "answer": `Explanation: If the data is invalid, it sends an error message.
                Incorrect Answer: Vague and does not specify the status code or how the validation error is detected.` },
                { "score": 1, "answer": `Explanation: It shows an error if the update doesn’t work.
                Incorrect Answer: Does not mention validation errors or how they are handled in the code.` }
              ]
            }
          ]
        },
        {
          "question_text": `Deleting a Task
          // Function to delete a task
          exports.deleteTask = async (req, res) => {
            try {
              const task = await Task.findByIdAndDelete(req.params.id);
              if (!task) {
                return res.status(404).json({ error: 'Task not found' });
              }
              res.json({ message: 'Task deleted successfully' });
            } catch (error) {
              res.status(500).json({ error: 'Internal server error' });
            }
          };
          What HTTP status code is returned if the task is not found, and why is it appropriate?`,
          "question_type": "Video",
          "media_url": "https://player.vimeo.com/video/1010435296",
          "text_instructions": "to evaluate practical tech knowledge",
          "question_order": 7,
          "reference_answers": [
            {
              "evaluation_category_id": 6,
              "answers": [
                { "score": 5, "answer": `Explanation: If the task is not found, the code returns a 404 status code with the message { error: 'Task not found' }. This is appropriate because a 404 status code indicates that the requested resource (in this case, the task with the specified ID) could not be found on the server, informing the client that the task does not exist.
                Correct Answer: Clearly explains the status code and provides a logical reason for its use, demonstrating a good understanding of RESTful principles.` },
                { "score": 4, "answer": `Explanation: It returns a 404 status code when the task is not found. This tells the client that the task does not exist.
                Correct Answer: Correct, but lacks detailed explanation of why a 404 status code is appropriate.` },
                { "score": 3, "answer": `Explanation: It sends a 404 error if the task is not there.
                Incorrect Answer: Basic understanding but lacks explanation of the status code’s purpose and context.` },
                { "score": 2, "answer": `Explanation: It returns an error if the task can’t be deleted because it’s not found.
                Incorrect Answer: Vague and doesn’t mention the specific 404 status code or why it’s used.` },
                { "score": 1, "answer": `Explanation: It sends an error if something is wrong with the task.
                Incorrect Answer: Shows no understanding of the specific status code or context for its use.` }
              ]
            }
          ]
        },
        {
          "question_text": `Deleting a Task
          // Function to delete a task
          exports.deleteTask = async (req, res) => {
            try {
              const task = await Task.findByIdAndDelete(req.params.id);
              if (!task) {
                return res.status(404).json({ error: 'Task not found' });
              }
              res.json({ message: 'Task deleted successfully' });
            } catch (error) {
              res.status(500).json({ error: 'Internal server error' });
            }
          };
          In the event that the task does not exist, what specific response is sent back to the client? Why is it important to provide this feedback?`,
          "question_type": "Video",
          "media_url": "https://player.vimeo.com/video/1010435310",
          "text_instructions": "to evaluate practical tech knowledge",
          "question_order": 8,
          "reference_answers": [
            {
              "evaluation_category_id": 6,
              "answers": [
                { "score": 5, "answer": `Explanation: If the task does not exist, the code sends a 404 status code along with the response { error: 'Task not found' }. This feedback is important because it clearly informs the client that the requested resource is not available. It helps avoid confusion and allows the client to handle the error appropriately, such as displaying a message to the user or logging the error for further investigation.
                Correct Answer: Provides the exact response and explains its importance in terms of client communication and error handling.` },
                { "score": 4, "answer": `Explanation: The response { error: 'Task not found' } with a 404 status code is sent. This lets the client know that the task doesn’t exist, which is useful for handling errors in the application.
                Correct Answer: Correct response and purpose, but the explanation of why it’s important could be more detailed.` },
                { "score": 3, "answer": `Explanation: It sends a 404 error message saying 'Task not found' if the task doesn’t exist. This is important to notify the client.
                Incorrect Answer: Basic understanding of the response but lacks depth in explaining why providing this feedback is critical.` },
                { "score": 2, "answer": `Explanation: It sends an error message if the task is not found. This helps the client know there’s an issue.
                Incorrect Answer: Vague and does not specify the exact message or why the feedback is significant beyond general error notification.` },
                { "score": 1, "answer": `Explanation: It sends an error if something is wrong.
                Incorrect Answer: Lacks any meaningful explanation of the response or its importance. Shows no understanding of the specific situation or feedback needed.` }
              ]
            }
          ]
        },
        {
          "question_text": `Handling Database Connection Errors with PostgreSQL
          // Function to connect to PostgreSQL
          const { Client } = require('pg');
          
          const connectToDatabase = async () => {
            const client = new Client({
              connectionString: process.env.POSTGRES_URI,
            });
          
            try {
              await client.connect();
              console.log('Connected to PostgreSQL');
            } catch (error) {
              console.error('Error connecting to PostgreSQL:', error);
              process.exit(1);
            }
          };
          What is the purpose of process.exit(1); in the catch block, and when would it be executed?`,
          "question_type": "Video",
          "media_url": "https://player.vimeo.com/video/1010435326",
          "text_instructions": "to evaluate practical tech knowledge",
          "question_order": 9,
          "reference_answers": [
            {
              "evaluation_category_id": 6,
              "answers": [
                { "score": 5, "answer": `Explanation: The process.exit(1); command in the catch block is used to terminate the Node.js process immediately with an exit code of 1, indicating an error. It is executed when there is an error connecting to the PostgreSQL database, such as incorrect credentials or network issues. This prevents the application from continuing to run in an unstable state and signals that a critical failure has occurred.
                Correct Answer: Clearly explains the purpose and context of using process.exit(1); and why it’s necessary for error handling.` },
                { "score": 4, "answer": `Explanation: process.exit(1); stops the program if there is an error connecting to the database. It is executed when there is a connection failure.
                Correct Answer: Correct, but lacks a detailed explanation of what the exit code 1 signifies and the importance of halting the application.` },
                { "score": 3, "answer": `Explanation: It stops the process when there is an error. It runs if there’s a problem with connecting to the database.
                Incorrect Answer: Basic understanding of when it’s executed, but lacks depth in explaining why it’s used or what the exit code 1 represents.` },
                { "score": 2, "answer": `Explanation: It exits the program if something goes wrong.
                Incorrect Answer: Vague and lacks detail about what triggers the exit or why it is necessary.` },
                { "score": 1, "answer": `Explanation: It just stops the code.
                Incorrect Answer: Shows no understanding of the purpose or context of process.exit(1); and when it would be executed.` }
              ]
            }
          ]
        },
        {
          "question_text": `Handling Database Connection Errors with PostgreSQL
          // Function to connect to PostgreSQL
          const { Client } = require('pg');
          
          const connectToDatabase = async () => {
            const client = new Client({
              connectionString: process.env.POSTGRES_URI,
            });
          
            try {
              await client.connect();
              console.log('Connected to PostgreSQL');
            } catch (error) {
              console.error('Error connecting to PostgreSQL:', error);
              process.exit(1);
            }
          };
          What additional error handling strategies could be implemented for managing different types of database errors (e.g., authentication errors, network issues)?`,
          "question_type": "Video",
          "media_url": "https://player.vimeo.com/video/1010435341",
          "text_instructions": "to evaluate practical tech knowledge",
          "question_order": 10,
          "reference_answers": [
            {
              "evaluation_category_id": 6,
              "answers": [
                { "score": 5, "answer": `Explanation: Implement specific error handling by checking the error.code property to identify different types of errors such as 28P01 for authentication failures or ENOTFOUND for network issues. Log detailed error messages with possible solutions, and consider retry logic with exponential backoff for transient errors like network issues. For critical errors, send alerts or notifications to the development team for immediate attention.
                Correct Answer: Provides a comprehensive and specific strategy for handling various error types, including detailed error codes, logging, retry logic, and alert mechanisms.` },
                { "score": 4, "answer": `Explanation: Check the error code to identify the type of error, such as authentication or network issues. Use different messages or actions depending on the error type, like retrying for network problems or logging critical errors for authentication failures.
                Correct Answer: Correct approach with specific strategies, but lacks detailed examples of error codes or retry mechanisms.` },
                { "score": 3, "answer": `Explanation: Use different error messages based on the type of error, and log all errors to monitor what’s going wrong.
                Incorrect Answer: Basic understanding of using error messages and logging but lacks specific handling strategies for different error types.` },
                { "score": 2, "answer": `Explanation: Log the errors and maybe try reconnecting if something goes wrong.
                Incorrect Answer: Vague, lacks specifics on error identification, and doesn’t address different handling for various error types.` },
                { "score": 1, "answer": `Explanation: Just show the error message and stop the process.
                Incorrect Answer: Shows no understanding of different error types or advanced error handling strategies.` }
              ]
            }
          ]
        }
      ],
      "EvaluationCriteria": [
        {
          "evaluation_category_id": 6,
          "priority": 1,
          "instructions": "Evaluate the candidate's technical skills and knowledge related to the specific domain."
        },
      ]
    },
    {
      "interview_name": "GenAI Knowledge",
      "interview_time_limit": 600,
      "time_limit_per_answer": 150,
      "status": "Published",
      "pre_interview_instructions": {
        "pre_interview_instructions": "Please speak clearly into your phone or laptop's microphone.",
        "welcome_message": "Welcome to Round 3 of our interview process. We wish you all the best!",
        "welcome_video_url": null,
        "context_video_url": null,
        "context_video_text": null,
        "language": "en-IN",
        "interview_response_type": "text"
      },
      "Questions": [
        {
          "question_text": "Explain the concept of a prompt in the context of language models like ChatGPT. How do you ensure that a prompt generates the most accurate and relevant response?",
          "question_type": "Video",
          "media_url": "https://player.vimeo.com/video/1028397605",
          "text_instructions": "To evaluate knowledge of use of chatgpt effectively",
          "question_order": 1,
          "reference_answers": [
            {
              "evaluation_category_id": 3,
              "answers": [
                { "score": 5, "answer": "Explains that a prompt is the input or query provided to the language model that guides its response. Discusses strategies such as using clear, specific, and well-structured prompts to reduce ambiguity and improve relevance. Mentions iterative refinement of prompts, experimenting with variations, and adjusting the phrasing to target the desired context. Highlights testing multiple prompts and analyzing responses for accuracy and relevance, with an emphasis on how a well-designed prompt directly influences the quality of the generated output." },
                { "score": 4, "answer": "Defines a prompt as the input that directs the language model's response. Emphasizes crafting specific and clear prompts to improve response relevance but lacks detail on testing or iterative refinement. Mentions ensuring accuracy by experimenting with different prompts, but doesn't provide detailed strategies for refining or evaluating the responses." },
                { "score": 3, "answer": "Describes a prompt as the input for guiding the model's output. Suggests using clear prompts but offers only general strategies like rewording the prompt for better results. Lacks depth in explaining techniques for prompt refinement or ensuring response accuracy." },
                { "score": 2, "answer": "Provides a basic definition of a prompt but lacks detail on how to craft effective ones or ensure accuracy in the responses. Mentions adjusting the prompt but without any explanation of specific techniques or strategies to improve response quality." },
                { "score": 1, "answer": "Gives an unclear or irrelevant explanation of what a prompt is. Fails to discuss any methods for ensuring accuracy or relevance in the generated responses. The answer lacks depth or is off-topic." }
              ]
            }
          ]
        },        
        {
          "question_text": "What techniques do you use to fine-tune ChatGPT outputs to make them more relevant and align with the topic's requirements from the content.",
          "question_type": "Video",
          "media_url": "https://player.vimeo.com/video/1015066481",
          "text_instructions": "To evaluate knowledge of use of chatgpt effectively",
          "question_order": 2,
          "reference_answers": [
            {
              "evaluation_category_id": 3,
              "answers": [
                { "score": 5, "answer": "Explains using clear, specific prompts, iterating on outputs, and refining tone and style to match the content’s topic. Mentions adjusting keywords, adding relevant details, and reviewing for accuracy and alignment with the topic's purpose. Emphasizes the importance of testing the output for relevance." },
                { "score": 4, "answer": "Mentions adjusting prompts and iterating outputs but lacks detail on specific techniques like keyword optimization or content alignment. Discusses tone adjustments but does not fully elaborate on how to ensure alignment with the topic." },
                { "score": 3, "answer": "Touches on refining outputs and adjusting tone but lacks specific methods to align the content with the topic’s requirements. Mentions relevance but without detailed strategies for achieving it." },
                { "score": 2, "answer": "Provides a vague response about improving outputs without discussing specific techniques. Mentions relevance or topic alignment but does not explain how these are achieved in practice." },
                { "score": 1, "answer": "Fails to mention relevant techniques or strategies for fine-tuning ChatGPT outputs. Offers no clear detail on how to improve relevance or alignment with the topic. The response is unclear or unrelated to the question." }
              ]
            }
          ]
        },
        {
          "question_text": "ChatGPT occasionally produces content that might not be accurate or contextually appropriate. How do you ensure the quality and relevance of the content it generates?",
          "question_type": "Video",
          "media_url": "https://player.vimeo.com/video/1015066498",
          "text_instructions": "To evaluate knowledge of use of chatgpt effectively",
          "question_order": 3,
          "reference_answers": [
            {
              "evaluation_category_id": 3,
              "answers": [
                { "score": 5, "answer": "Mentions verifying facts through reliable sources, cross-checking output for context accuracy, and iterating on responses to refine relevance. Explains using precise prompts and conducting manual reviews to ensure alignment with the topic and audience. Emphasizes the importance of human oversight and post-generation edits." },
                { "score": 4, "answer": "Mentions fact-checking and reviewing outputs for accuracy but lacks depth in explaining context checks. Discusses refining prompts and manual review but doesn’t provide specific examples of how to correct errors or inaccuracies." },
                { "score": 3, "answer": "Touches on checking accuracy and relevance but provides only basic techniques like adjusting prompts or briefly reviewing content. Lacks detailed strategies for managing context errors or ensuring high-quality output." },
                { "score": 2, "answer": "Provides a vague response about improving accuracy or relevance but fails to mention specific steps like fact-checking or context verification. Lacks clarity on how errors or inappropriate content are addressed." },
                { "score": 1, "answer": "Fails to address the need for fact-checking or verifying context. Offers no clear methods to ensure quality or relevance in the output. The response is unclear or irrelevant to the question" }
              ]
            }
          ]
        },
        {
          "question_text": "If you wanted to create a structured output, such as a JSON-formatted response for extracting specific data fields, how would you formulate your prompt?",
          "question_type": "Video",
          "media_url": "https://player.vimeo.com/video/1028397575",
          "text_instructions": "To evaluate knowledge of use of chatgpt effectively",
          "question_order": 4,
          "reference_answers": [
            {
              "evaluation_category_id": 3,
              "answers": [
                { "score": 5, "answer": "Explains how to explicitly instruct the model to output a JSON structure by specifying key fields and expected values in the prompt. Mentions using clear, precise language to indicate the desired fields and their formats, such as: 'Generate a JSON response with the following fields: name, age, and email.' Also emphasizes the importance of providing examples of the desired output format in the prompt to ensure consistency and accuracy. Discusses refining the prompt iteratively based on the output and validating the JSON for correctness." },
                { "score": 4, "answer": "Describes how to request JSON output by specifying the required fields and values in the prompt. Highlights the importance of clarity when defining the structure but lacks depth in discussing providing examples or iteratively refining the prompt. Touches on checking the output for accuracy but doesn't elaborate on validation techniques." },
                { "score": 3, "answer": "Mentions requesting JSON-formatted output by specifying fields but lacks detail on how to ensure the correct structure. Suggests formulating prompts with specific fields but doesn't go into depth on how to verify or refine the output." },
                { "score": 2, "answer": "Provides a vague explanation of asking for JSON but lacks clarity on how to properly structure the prompt or ensure accuracy. Fails to mention specifying key fields or validating the JSON output." },
                { "score": 1, "answer": "Does not provide a clear explanation of how to formulate a prompt for JSON output. The response is unclear, irrelevant, or does not mention specific strategies for generating structured responses." }
              ]
            }
          ]
        }             
      ],
      "EvaluationCriteria": [
        {
          "evaluation_category_id": 3,
          "priority": 1,
          "instructions": "Quantitative and Qualitative Asessment of a candidate's ability to do the required job."
        }
      ]
    },
    {
      "interview_name": "Logical Reasoning",
      "interview_time_limit": 600,
      "time_limit_per_answer": 150,
      "status": "Published",
      "pre_interview_instructions": {
      "pre_interview_instructions": "Please speak clearly into your phone or laptop's microphone.",
      "welcome_message": "Welcome to Round 4 of our interview process. We wish you all the best!",
      "welcome_video_url": null,
      "context_video_url": null,
      "context_video_text": null
    },
      "Questions": [
        {
          "question_text": "You have two ropes. Each rope takes exactly one hour to burn from one end to the other, but the ropes do not burn at a uniform rate (i.e., half the rope could take almost the full hour to burn, while the rest might burn quickly). How can you measure exactly 45 minutes using these two ropes and a lighter?",
          "question_type": "Video",
          "media_url": "https://player.vimeo.com/video/1011535287",
          "text_instructions": "to test logical ability",
          "question_order": 1,
          "reference_answers": [
            {
              "evaluation_category_id": 9,
              "answers": [
                { "score": 5, "answer": "Approach: Light Rope 1 from both ends and Rope 2 from one end simultaneously. When Rope 1 completely burns out (30 minutes), light the other end of Rope 2. Rope 2 will now take 15 minutes to burn completely, giving you a total of 45 minutes. Correct Answer: Precisely measures 45 minutes with a clear and correct approach." },
                { "score": 4, "answer": "Approach: Light Rope 1 from both ends and Rope 2 from one end. Once Rope 1 burns out, light the other end of Rope 2. Correct Answer: Correct, but lacks explanation on why the total time is 45 minutes." },
                { "score": 3, "answer": "Approach: Light both ropes from one end, then light the other end of one rope after a certain amount of time. Incorrect Answer: Approach shows understanding of the problem, but timing is not clear or incorrect." },
                { "score": 2, "answer": "Approach: Light one rope from both ends and the other from one end, wait for both to burn. Incorrect Answer: Fails to accurately measure 45 minutes; approach is unclear and results in 30 or 60 minutes." },
                { "score": 1, "answer": "Approach: Light both ropes from one end and wait for them to burn completely. Incorrect Answer: Does not solve the problem or measure 45 minutes accurately. Approach and understanding are incorrect." }
              ]
            }
          ]
        },
        {
          "question_text": "You are given the results of a survey from 1,000 students about their study habits, and the data includes a variety of factors like study hours, Marks , eating habits, monthly spend habits and extracurricular activities. You need to figure out if there’s a correlation between the students eating habits , monthly spend and their marks. How would you go about analyzing this data to reach a conclusion?",
          "question_type": "Video",
          "media_url": "https://player.vimeo.com/video/1011535310",
          "text_instructions": "to test data analysis ",
          "question_order": 2,
          "reference_answers": [
            {
              "evaluation_category_id": 9,
              "answers": [
                { "score": 5, "answer": "Approach: I would start by organizing the data to focus on students' eating habits, monthly spending, and marks. Then, I would compare groups of students with similar eating habits and spending patterns to see if there are any noticeable differences in their marks. Finally, I would look for trends or patterns that suggest a relationship." },
                { "score": 4, "answer": "Approach: I would group the data based on eating habits and spending, and then look at the average marks in each group to see if there are any differences. This would help identify if there's a link between these factors and academic performance." },
                { "score": 3, "answer": "Approach: I would look at the marks of students and compare them with their eating and spending habits to see if there is any obvious connection. If students who spend more or eat a certain way tend to have higher or lower marks, that might indicate a relationship." },
                { "score": 2, "answer": "Approach: I would just check if students who spend a lot or eat unhealthy have lower marks. If I see a lot of them, that probably means there’s a connection." },
                { "score": 1, "answer": "Approach: I would ask the students directly if they think their spending or eating affects their marks, or just look at their marks without considering the other factors." }
              ]
            }
          ]
        },
        {
          "question_text": "You are in a room with two doors: one leads to freedom, and the other to a deadly trap. Each door has a guard. One guard always tells the truth, and the other always lies. You can ask one question to either guard to find out which door leads to freedom. What do you ask?",
          "question_type": "Video",
          "media_url": "https://player.vimeo.com/video/1011535328",
          "text_instructions": "to test logical ability",
          "question_order": 3,
          "reference_answers": [
            {
              "evaluation_category_id": 9,
              "answers": [
                { "score": 5, "answer": "Approach: Ask either guard, “If I asked the other guard which door leads to freedom, what would they say?” Then, choose the opposite door. This works because the truth-teller will report the liar's incorrect answer, and the liar will lie about the truth-teller’s correct answer, both pointing to the wrong door. Correct Answer: Provides a clear and logical approach, explaining why it works with precise reasoning." },
                { "score": 4, "answer": "Approach: Ask either guard, “What would the other guard say is the door to freedom?” and then take the opposite door. This correctly identifies the door but doesn’t fully explain the logic behind why it works. Correct Answer: Correct answer, but lacks a detailed explanation of why it’s effective." },
                { "score": 3, "answer": "Approach: Ask one guard, Which door would you say is the safe one? and choose the opposite. This shows understanding but is incorrect because it doesn’t account for both guards' behaviors. Incorrect Answer: Good thought process but flawed approach that doesn’t guarantee success." },
                { "score": 2, "answer": "Approach: Ask one guard, “Is this the door to freedom?” and then decide based on their answer. This approach fails because it doesn’t consider the truth-teller/ liar dynamic. Incorrect Answer: Incorrect logic and unreliable method to determine the correct door." },
                { "score": 1, "answer": "Approach: Choose any door randomly or ask a vague question like “Which door is good?” without considering the guard's nature. Incorrect Answer: No understanding of the problem or how to use the guards’ behavior to find the safe door." }
              ]
            }
          ]
        },
        {
          "question_text": "You are on the ground floor and need to get to the 100th floor of a building. The elevator can only move up in increments of 3 floors and down in increments of 2 floors. Can you reach the 100th floor using the elevator? If so, how?",
          "question_type": "Video",
          "media_url": "https://player.vimeo.com/video/1011536007",
          "text_instructions": "to test presence of mind ",
          "question_order": 4,
          "reference_answers": [
            {
              "evaluation_category_id": 9,
              "answers": [
                { "score": 5, "answer": "Approach: Yes, you can reach the 100th floor. Start at the ground floor (0), move up 3 floors repeatedly until you reach a multiple of 5 (e.g., 0 → 3 → 6 → 9 → 12 → 15). Once at a multiple of 5, you can cycle up 3 and down 2 repeatedly to gain 1 floor each time (e.g., 15 -> 18 -> 16 -> 19 -> 17, etc.) until you reach 100. Correct Answer: Provides a clear, step-by-step approach to reach the 100th floor, including the logic of using multiples of 5 to gain 1 floor repeatedly." },
                { "score": 4, "answer": "Approach: Yes, move up 3 floors repeatedly, then use a pattern of moving up 3 and down 2 to eventually reach 100. You will gain 1 floor each cycle. Correct Answer: Correct answer but lacks specific explanation of how to start and use multiples of 5 to simplify the process." },
                { "score": 3, "answer": "Approach: Yes, keep going up 3 floors and down 2 floors until you reach 100. It will eventually work out. Incorrect Answer: Correct concept, but vague and unclear on how to implement the solution." },
                { "score": 2, "answer": "Approach: Move up 3 floors continuously until you reach 100. If you go past, come back down. Incorrect Answer: Incorrect approach as it doesn’t consider that you can’t go directly in increments of 3 to reach 100. Doesn’t acknowledge the down movements." },
                { "score": 1, "answer": "Approach: It is not possible because the elevator goes up by 3 and down by 2, so you can’t reach exactly 100. Incorrect Answer: Incorrect conclusion without attempting a viable strategy. Shows no understanding of how to manipulate the movements to reach the goal." }
              ]
            }
          ]
        }
      ],
      "EvaluationCriteria": [
        {
          "evaluation_category_id": 9,
          "priority": 1,
          "instructions": "Candidates are assessed on their ability to logically think through various scenarios and puzzles."
        }
      ]
    }
  ]
};

module.exports = { jobInterviewTemplate };