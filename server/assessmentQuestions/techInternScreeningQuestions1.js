// techInternScreeningQuestions.js

const techInternScreeningQuestions = {
    "hr_questions": [
      {
        "id": 2,
        "question": "What motivates you to get up and go to work (or class) every day? What aspects of your job or studies do you find most fulfilling?"
      },
      {
        "id": 3,
        "question": "Describe a challenging situation you faced at work or college and how you handled it. What did you learn from the experience?"
      },
      {
        "id": 4,
        "question": "Imagine you have an unexpected day off. How would you spend it and why?"
      },
      {
        "id": 5,
        "question": "What values are most important to you in a workplace or academic environment, and how do you embody those values in your daily work?"
      },
      {
        "id": 6,
        "question": "Tell me about a time when you had to learn a new skill quickly. How did you approach the learning process, and what was the result?"
      }
    ],
    "technical_questions": {
      "nodejs": [
        {
          "id": 8,
          "question": "Describe the process of setting up a basic Node.js server. What modules would you use and why?",
          "purpose": "Assess the candidate's familiarity with the basic setup and essential modules of Node.js."
        },
        {
          "id": 9,
          "question": "How do you manage environment variables in a Node.js application?",
          "purpose": "Evaluate their understanding of configuration management and security practices."
        },
        {
          "id": 10,
          "question": "Explain how you would handle file uploads in a Node.js application.",
          "purpose": "Test practical knowledge of handling common tasks in web applications."
        },
        {
          "id": 11,
          "question": "Can you discuss a situation where you had to optimize a Node.js application for performance? What steps did you take?",
          "purpose": "Understand their experience with performance tuning and optimization."
        },
        {
          "id": 12,
          "question": "How would you implement authentication and authorization in a Node.js application?",
          "purpose": "Assess knowledge of security practices and familiarity with libraries like Passport.js or JWT."
        }
      ],
      "reactjs": [
        {
          "id": 13,
          "question": "Explain the lifecycle methods of a React class component. How do they compare to hooks in functional components?",
          "purpose": "Test understanding of both class and functional components and their lifecycle management."
        },
        {
          "id": 14,
          "question": "Describe how you would manage state in a large-scale React application. Compare using local state, Context API, and Redux.",
          "purpose": "Evaluate their knowledge of state management solutions and when to use each."
        },
        {
          "id": 15,
          "question": "How would you handle form validation in a React application?",
          "purpose": "Assess practical knowledge of handling user inputs and maintaining form state."
        },
        {
          "id": 16,
          "question": "Can you describe a challenging bug you encountered in a React application and how you resolved it?",
          "purpose": "Test problem-solving skills and practical experience with debugging."
        },
        {
          "id": 17,
          "question": "How would you implement a responsive design in a React application?",
          "purpose": "Evaluate their understanding of CSS-in-JS solutions, media queries, and responsive design principles."
        }
      ]
    },
    "green_energy_case_study": {
      "background_video_script": `[Opening Scene: A bustling Indian city skyline transitioning to the countryside with wind turbines and solar panels]
  Narrator: "In the 21st century, India’s energy landscape is undergoing a transformative change. Renewable energy sources like wind, solar, and hydropower are not only reducing our dependence on fossil fuels but also driving economic growth and innovation. Today, we'll explore how renewable energy is reshaping our nation and what it means for the future."
  [Scene: Solar panels glistening under the sun in a rural village]
  Narrator: "Solar energy, harnessed from the sun's rays, has become one of the most rapidly growing sources of power in India. With initiatives like the National Solar Mission, technological advancements have significantly reduced the cost of solar panels, making them more accessible than ever before."
  [Scene: Wind turbines spinning in a vast open field in Tamil Nadu]
  Narrator: "Wind energy, generated from the movement of air, is another key player. States like Tamil Nadu and Gujarat are leading the way with large-scale wind farms, producing significant amounts of electricity with minimal environmental impact."
  [Scene: The Tehri Dam releasing water]
  Narrator: "Hydropower, the energy derived from flowing water, has been used for centuries. India, with its numerous rivers, has a vast potential for hydropower, which remains a vital part of our energy mix, providing reliable and sustainable power."
  [Scene: A busy research lab with scientists working on renewable energy technology in Bengaluru]
  Narrator: "The shift to renewable energy is not just about technology; it's about innovation. Across India, researchers are developing new ways to store and distribute renewable energy, making it more efficient and reliable."
  [Scene: A bustling marketplace with people buying and selling goods]
  Narrator: "But the impact of renewable energy goes beyond the environment. It’s driving economic growth by creating jobs in manufacturing, installation, and maintenance of renewable energy systems. It’s also reducing energy costs for businesses and consumers."
  [Scene: An international conference with Indian leaders discussing renewable energy policies]
  Narrator: "On a global scale, India is recognizing the strategic importance of renewable energy. Our commitment to international agreements and policies, such as the Paris Agreement, is promoting renewable energy investments and reducing carbon emissions."
  [Closing Scene: A bright future with renewable energy installations integrated into daily life across India]
  Narrator: "As we look to the future, renewable energy promises a cleaner, more sustainable world for India. It’s an exciting time of change and opportunity, with renewable energy at the heart of our national progress."
  [Screen fades to black with a hopeful background score]
  Narrator: "The question is, how will we harness this potential to create a better tomorrow for India?"`,
      "questions": [
        {
          "id": 1,
          "question": "What are the main drivers behind the rapid growth of solar energy in India in recent years? Discuss the technological and economic factors involved.",
          "category": "Analytical Skills"
        },
        {
          "id": 2,
          "question": "Given that a wind turbine in Tamil Nadu produces an average of 2.5 megawatts of electricity and there are 500 turbines in a wind farm, calculate the total electricity generated by the wind farm in a day if each turbine operates at 75% capacity for 24 hours.",
          "category": "Quantitative Skills"
        },
        {
          "id": 3,
          "question": "Explain how hydropower can be both a sustainable and reliable source of energy for India. What are the potential drawbacks of relying heavily on hydropower in the Indian context?",
          "category": "Logical Skills"
        },
        {
          "id": 4,
          "question": "Discuss the economic benefits that renewable energy can bring to local communities in India. Include examples of job creation and cost savings.",
          "category": "Business Acumen"
        },
        {
          "id": 5,
          "question": "Imagine you are presenting the benefits of renewable energy to a group of high school students in India. How would you explain the importance of renewable energy in simple terms?",
          "category": "Communication Skills"
        },
        {
          "id": 6,
          "question": "Propose an innovative solution to overcome one of the major challenges facing renewable energy adoption in India today, such as energy storage or grid integration.",
          "category": "Out-of-the-Box Thinking"
        },
        {
          "id": 7,
          "question": "Analyze the role of Indian policies in promoting renewable energy. How effective are these policies in driving national change?",
          "category": "Critical Thinking"
        },
        {
          "id": 8,
          "question": "Identify and describe a recent breakthrough in renewable energy technology developed in India. How does this breakthrough contribute to the overall efficiency and adoption of renewable energy?",
          "category": "Research Skills"
        },
        {
          "id": 9,
          "question": "Consider a scenario where a rural community in India relies solely on solar energy. What measures would you implement to ensure a continuous power supply during extended periods of cloudy weather?",
          "category": "Problem-Solving Skills"
        },
        {
          "id": 10,
          "question": "How would you address the concerns of individuals in India who are skeptical about transitioning to renewable energy? Provide a strategy for effective communication and persuasion.",
          "category": "Interpersonal Skills"
        }
      ]
    }
  };
  
  module.exports = { techInternScreeningQuestions };
  