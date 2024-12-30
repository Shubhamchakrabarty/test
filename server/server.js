// server/server.js
require('dotenv').config();
const http = require('http');
const socketIo = require('socket.io');
const app = require('./app'); // Import the Express app
const { Education } = require('./models'); // Import the Education model

const port = process.env.PORT || 5000;

// Log environment variables
console.log('Environment Variables inside server.js:');
console.log('PORT:', process.env.PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('AWS_REGION:', process.env.AWS_REGION);
console.log('DB_NAME_PROD:', process.env.DB_NAME_PROD);
console.log('DB_USER_PROD:', process.env.DB_USER_PROD);
console.log('DB_HOST_PROD:', process.env.DB_HOST_PROD);
console.log('DB_PORT_PROD:', process.env.DB_PORT_PROD);
console.log('S3_BUCKET_NAME_PROD:', process.env.S3_BUCKET_NAME_PROD);
console.log('S3_CV_BUCKET_NAME_PROD:', process.env.S3_CV_BUCKET_NAME_PROD);
console.log('REDIS_HOST:', process.env.REDIS_HOST);
console.log('REDIS_PORT:', process.env.REDIS_PORT);


// Create HTTP server and Socket.IO instance
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
      origin: '*', // Allow all origins, you can restrict this to your frontend URL
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type'],
      credentials: true
    }
  });

// Listen for connection events
io.on('connection', (socket) => {
    console.log('New client connected', socket.id);

    // Join room for a specific user
    socket.on('joinRoom', (userId) => {
        socket.join(userId);
        console.log(`Client joined room: ${userId}`);
    });

    // Emit education data when new data is added
    Education.afterCreate((education) => {
        io.to(education.user_id).emit('educationData', education);
    });
  
    // Disconnect event
    socket.on('disconnect', () => {
      console.log('Client disconnected', socket.id);
    });
  });

// Start the server
console.log('About to start the server');
server.listen(port, (err) => {
  if (err) {
      console.error('Failed to start server:', err);
      process.exit(1);
  }
  console.log(`Server running on port ${port}`);
});
  
module.exports = io; // Export the io instance for other files to use if needed
  
  

