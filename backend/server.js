require('dotenv').config({ override: true });
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db').default;
const mongoose = require('mongoose');
const http = require('http'); 
const socketIo = require('socket.io'); 

const app = express();
const server = http.createServer(app); // Create an HTTP server
const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});

// ✅ Attach `io` globally
global.io = io;  

const PORT = process.env.PORT || 6969;

app.get('/', (req, res) => {
  res.send("hello from backend")
})

// // Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const requireDatabase = (req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    return next();
  }

  return res.status(503).json({
    message: 'Database is unavailable. Check backend/.env MONGO_URI and restart the backend.',
  });
};

// // Import and use routes *AFTER* setting up `io`
const authRoutes = require('./routes/auth');
const hallsRoutes = require('./routes/hallreq');
const reservedSeatsRoutes = require('./routes/seatreserve');  
const getSeats = require('./routes/getSeats');
const userBookings = require('./routes/userBookings');

app.use(hallsRoutes);
app.use(authRoutes);
app.use(requireDatabase, reservedSeatsRoutes);
app.use(requireDatabase, getSeats);
app.use(requireDatabase, userBookings);

// WebSocket Connection
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start the server even when the database is unavailable so non-DB routes can run
// and DB routes can return a clear 503 instead of crashing the process.
connectDB().finally(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});


module.exports = server;
