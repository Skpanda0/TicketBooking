require('dotenv').config();
const express = require('express');
const http = require('http'); 
const socketIo = require('socket.io'); 
const connectDB = require('./config/db');

const app = express();
const server = http.createServer(app);

// ✅ Use Render's dynamic port
const PORT = process.env.PORT || 10000;

if (!PORT) {
  throw new Error("❌ PORT is not defined in environment variables");
}

// Default Route
app.get('/', (req, res) => {
  res.send('✅ Backend is running!');
});

// WebSocket Setup
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

// Connect to MongoDB
connectDB();

// Middleware
app.use(require('cors')());
app.use(express.json());

// Import and use routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/halls', require('./routes/hallreq'));
app.use('/api/seats', require('./routes/seatreserve'));
app.use('/api/getSeats', require('./routes/getSeats'));
app.use('/api/userBookings', require('./routes/userBookings'));

// Graceful shutdown to prevent multiple instances
process.on('SIGTERM', () => {
  console.log('🚀 Gracefully shutting down...');
  server.close(() => {
    console.log('✅ Server closed.');
    process.exit(1);
  });
});

// ✅ Start the server with dynamic port
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = server;
