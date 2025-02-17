

// const app = express();


// const PORT = process.env.PORT || 10000; // Remove hardcoded 10000
// if (!PORT) {
//   throw new Error("❌ PORT is not defined in environment variables");
// }

// app.get('/api', (req, res) => {
//   res.send('✅ Backend is running!');
// });

// server.on('error', (err) => {
//   console.log(err)
//   // if (err.code === 'EADDRINUSE') {
//   //   console.error(`⚠️ Port ${PORT} is already in use. Exiting...`);
//   //   // process.exit(1);
//   // }
// });



// // Middleware





// // ✅ Graceful shutdown for Render restarts
// // process.on('SIGTERM', () => {
// //   console.log('🚀 Gracefully shutting down...');
// //   server.close(() => {
// //     console.log('✅ Server closed.');
// //     process.exit(1);  // Force exit
// //   });
// // });

// // ✅ Start the server using the dynamic port
// server.listen(PORT, '0.0.0.0', () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });

// module.exports = server;
// app.use('/api/auth', authRoutes);
// app.use('/api/halls', hallsRoutes);
// app.use('/api/seats', reservedSeatsRoutes);
// app.use('/api/getSeats', getSeats);
// app.use('/api/userBookings', userBookings);

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');
const http = require('http'); 
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app); // Create HTTP server

const PORT = process.env.PORT || 6969; // Use dynamic port

// ✅ Connect to MongoDB BEFORE starting the server
connectDB();

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// ✅ Define Routes
const authRoutes = require('./routes/auth');
const hallsRoutes = require('./routes/hallreq');
const reservedSeatsRoutes = require('./routes/seatreserve');
const getSeats = require('./routes/getSeats');
const userBookings = require('./routes/userBookings');

// ✅ API Routes (Best Practice: Use /api prefix)
app.use('/api/auth', authRoutes);
app.use('/api/halls', hallsRoutes);
app.use('/api/seats', reservedSeatsRoutes);
app.use('/api/getSeats', getSeats);
app.use('/api/userBookings', userBookings);

// ✅ Root route for API status check
app.get('/', (req, res) => {
    res.send('✅ Backend is running!');
});

// ✅ WebSocket Setup (BEFORE starting the server)
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

// ✅ Start Server using `server.listen()` (NOT `app.listen()`)
server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});

module.exports = server;
