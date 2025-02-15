require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');
const http = require('http'); 
const socketIo = require('socket.io'); 

const app = express();
const server = http.createServer(app); // Create an HTTP server

const PORT = process.env.PORT || 5000;

// Ensure only one instance of WebSocket is created
if (!global.io) {
  global.io = socketIo(server, {
    cors: {
      origin: "*",
    },
  });

  global.io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
} else {
  console.log("WebSocket server already running.");
}

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Import and use routes *AFTER* setting up WebSocket
const authRoutes = require('./routes/auth');
const hallsRoutes = require('./routes/hallreq');
const reservedSeatsRoutes = require('./routes/seatreserve');  
const getSeats = require('./routes/getSeats');
const userBookings = require('./routes/userBookings');

app.use(authRoutes);
app.use(hallsRoutes);
app.use(reservedSeatsRoutes);
app.use(getSeats);
app.use(userBookings);

// Prevent multiple instances from listening on the same port
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Exiting...`);
    process.exit(1);
  }
});

// Start the server only if it's not already running
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = server;
