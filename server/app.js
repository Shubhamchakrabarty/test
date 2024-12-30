// server/app.js
require('dotenv').config();

const db = require('./models');

// Log the database configuration being used
console.log('Database Configuration:');
console.log('Database:', db.sequelize.config.database);
console.log('Username:', db.sequelize.config.username);
console.log('Host:', db.sequelize.config.host);
console.log('Port:', db.sequelize.config.port);



const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const universityRoutes = require('./routes/universityRoutes');
const educationRoutes = require('./routes/educationRoutes');
const degreeRoutes = require('./routes/degreeRoutes');
const jobsRoutes = require('./routes/jobsRoutes');
const skillRoutes = require('./routes/skillRoutes');
const extracurricularsRoutes = require('./routes/extracurricularsRoutes');
const hobbiesRoutes = require('./routes/hobbies');
const languagesRoutes = require('./routes/languageRoutes');
const projectsRoutes = require('./routes/projectRoutes');
const customSectionsRoutes = require('./routes/customSectionsRoutes');
const referencesRoutes = require('./routes/referencesRoutes');
const cvRoutes = require('./routes/cvRoutes');
const scoreRoutes = require('./routes/scoreRoutes');
const interviewRoutes = require('./routes/interviewRoutes');
const audioRoutes = require('./routes/audioRoutes');
const clientRoutes = require('./routes/clientRoutes');
const clientUserRoutes = require('./routes/clientUserRoutes');
const clientJobRoutes = require('./routes/clientJobRoutes');
const clientJobInterviewRoutes = require('./routes/clientJobInterviewRoutes');
const questionRoutes = require('./routes/questionRoutes');
const interviewQuestionRoutes = require('./routes/interviewQuestionRoutes');
const userJobRoutes = require('./routes/userJobRoutes');
const userClientJobInterviewAttemptRoutes = require('./routes/userClientJobInterviewAttemptRoutes');
const jobInterviewEvaluationCategoriesRoutes = require('./routes/jobInterviewEvaluationCategoriesRoutes');
const jobEvaluationCriteriaRoutes = require('./routes/jobEvaluationCriteriaRoutes');
const interviewEvaluationCriteriaRoutes = require('./routes/interviewEvaluationCriteriaRoutes');
const questionEvaluationCriteriaRoutes = require('./routes/questionEvaluationCriteriaRoutes');
const jobInterviewPromptRoutes = require('./routes/jobInterviewPromptRoutes');
const textUploadRoutes = require('./routes/textUploadRoutes');
const cvDetailsRoutes = require('./routes/cvDetailsRoutes');
const clientJobScreeningRoutes = require('./routes/clientJobScreeningRoutes');
const textGenerationRoutes = require('./routes/textGenerationRoutes');
const notificationUseCaseRoutes = require('./routes/notificationUseCaseRoutes');
const notificationTemplateRoutes = require('./routes/notificationTemplateRoutes');
const clientJobNotificationRoutes = require('./routes/clientJobNotificationRoutes');
const videoUploadRoutes = require('./routes/videoUploadRoutes');

const app = express();
//const port = process.env.PORT || 5000;

// Create HTTP server
//const server = http.createServer(app);

// Create Socket.IO instance
//const io = socketIo(server);

// Middleware to parse JSON bodies
app.use(cors()); // Enable CORS
app.use(bodyParser.json());
// Serve the static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));

//Route to handle homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

// Use the auth routes
app.use('/auth', authRoutes);

// Use the university routes
app.use('/api', universityRoutes);

// Use the degree routes
app.use('/api', degreeRoutes);

// Use the education routes
app.use('/api', educationRoutes);
// Use the jobs routes
app.use('/api', jobsRoutes);
// Use the skills routes
app.use('/api', skillRoutes);
app.use('/api', cvRoutes);
app.use('/api', cvDetailsRoutes);
app.use('/api', audioRoutes);
app.use('/api', textUploadRoutes);
app.use('/api', clientJobScreeningRoutes);
app.use('/api/extracurriculars', extracurricularsRoutes);
app.use('/api/hobbies', hobbiesRoutes);
app.use('/api/languages', languagesRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/customsections', customSectionsRoutes);
// Register the reference routes
app.use('/api/references', referencesRoutes);
app.use('/api/scores', scoreRoutes);
app.use('/api', textGenerationRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api', clientRoutes);
app.use('/api', clientUserRoutes);
app.use('/api', clientJobRoutes);
app.use('/api/client-job-interviews', clientJobInterviewRoutes);
app.use('/api', questionRoutes);
app.use('/api/interview-questions', interviewQuestionRoutes);
app.use('/api', userJobRoutes);
app.use('/api', userClientJobInterviewAttemptRoutes);
app.use('/api/job-interview-evaluation-categories', jobInterviewEvaluationCategoriesRoutes);
app.use('/api/job-evaluation-criteria', jobEvaluationCriteriaRoutes);
app.use('/api/interview-evaluation-criteria', interviewEvaluationCriteriaRoutes);
app.use('/api/question-evaluation-criteria', questionEvaluationCriteriaRoutes);
app.use('/api/job-interview-prompts', jobInterviewPromptRoutes);
app.use('/api/notification-use-cases', notificationUseCaseRoutes);
app.use('/api', notificationTemplateRoutes);
app.use('/api/client-job-notifications', clientJobNotificationRoutes);
// Video upload routes
app.use('/api/video-upload', videoUploadRoutes);
// Catch all other routes and return the index file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

// Start the server
//app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
//});

// Export the io instance
module.exports = app;