require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');
const http = require('http'); 
const socketIo = require('socket.io'); 

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000; // ✅ Use Render's dynamic port

// Check if something is already running on the port
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`⚠️ Port ${PORT} is already in use. Exiting...`);
    process.exit(1);
  }
});

// Ensure WebSocket runs only once
if (!global.io) {
  global.io = socketIo(server, {
    cors: {
      origin: "*",
    },
  });

  global.io.on('connection', (socket) => {
    console.log('✅ User connected:', socket.id);

    socket.on('disconnect', () => {
      console.log('❌ User disconnected:', socket.id);
    });
  });
}

// ✅ Close any previous server before restarting (Prevents multiple instances)
if (server.listening) {
  console.log("⚠️ Closing previous instance before restarting...");
  server.close();
}

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Import and use routes
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

// ✅ Graceful shutdown on restart
process.on('SIGTERM', () => {
  console.log('🚀 Gracefully shutting down...');
  server.close(() => {
    console.log('✅ Server closed.');
    process.exit(0);
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = server;
