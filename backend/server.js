require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');
const http = require('http'); 
const socketIo = require('socket.io'); 

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 6969; // ✅ Corrected the PORT logic

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// ✅ Connect to MongoDB
connectDB();

// ✅ Define Routes
const authRoutes = require('./routes/auth');
const hallsRoutes = require('./routes/hallreq');
const reservedSeatsRoutes = require('./routes/seatreserve');
const getSeats = require('./routes/getSeats');
const userBookings = require('./routes/userBookings');

app.use('/api/auth', authRoutes);
app.use('/api/halls', hallsRoutes);
app.use('/api/seats', reservedSeatsRoutes);
app.use('/api/getSeats', getSeats);
app.use('/api/userBookings', userBookings);

// ✅ Ensure API responds correctly
app.get('/api', (req, res) => {
  res.send('✅ Backend is running!');
});

// ✅ Fix WebSocket Support for Render
if (!global.io) {
  global.io = socketIo(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
    transports: ["websocket", "polling"], // ✅ Added polling support for Render
  });

  global.io.on('connection', (socket) => {
    console.log('✅ User connected:', socket.id);

    socket.on('disconnect', () => {
      console.log('❌ User disconnected:', socket.id);
    });
  });
}

// ✅ Handle Server Errors (Fix EADDRINUSE)
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`⚠️ Port ${PORT} is already in use. Exiting...`);
    process.exit(1);
  } else {
    console.error(err);
  }
});

// ✅ Graceful shutdown for Render restarts
process.on('SIGTERM', () => {
  console.log('🚀 Gracefully shutting down...');
  server.close(() => {
    console.log('✅ Server closed.');
    process.exit(1);
  });
});

// ✅ Start the server
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = server;
