require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');
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
// global.io = io;  

const PORT = process.env.PORT || 6969;

// Connect to MongoDB
connectDB();

app.get('/', (req, res) => {
  res.send("hello from backend")
})

// // Middleware
// app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// // Import and use routes *AFTER* setting up `io`
const authRoutes = require('./routes/auth');
// const hallsRoutes = require('./routes/hallreq');
const reservedSeatsRoutes = require('./routes/seatreserve');  
const getSeats = require('./routes/getSeats');
// const userBookings = require('./routes/userBookings');

app.use(authRoutes);
// app.use(hallsRoutes);
app.use(reservedSeatsRoutes);
app.use(getSeats);
// app.use(userBookings);

// // WebSocket Connection
// io.on('connection', (socket) => {
//   console.log('User connected:', socket.id);

//   socket.on('disconnect', () => {
//     console.log('User disconnected:', socket.id);
//   });
// });

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


module.exports = server;
