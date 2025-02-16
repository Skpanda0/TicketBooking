require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');
const http = require('http'); 
const socketIo = require('socket.io'); 

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 10000; 

app.get('/', (req, res) => {
  res.send('✅ Backend is running!');
});

server.on('error', (err) => {
  console.log(err)
  // if (err.code === 'EADDRINUSE') {
  //   console.error(`⚠️ Port ${PORT} is already in use. Exiting...`);
  //   // process.exit(1);
  // }
});

// ✅ Ensure only one WebSocket instance
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

// app.use('/api/auth', authRoutes);
// app.use('/api/halls', hallsRoutes);
// app.use('/api/seats', reservedSeatsRoutes);
// app.use('/api/getSeats', getSeats);
// app.use('/api/userBookings', userBookings);


// ✅ Graceful shutdown for Render restarts
// process.on('SIGTERM', () => {
//   console.log('🚀 Gracefully shutting down...');
//   server.close(() => {
//     console.log('✅ Server closed.');
//     process.exit(1);  // Force exit
//   });
// });

// ✅ Start the server using the dynamic port
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = server;
