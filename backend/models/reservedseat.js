const mongoose = require('mongoose');

// Hall subdocument schema


const ReservedSeatschema = new mongoose.Schema({
  movieName: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  timing: {
    type: String,
    required: true,
  },
  hallName: {
    type: {
      name: { type: String, required: true },
      seats: { type: Number, required: true },
    },
    required: true,
  },
  day: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  month: {
    type: String,
    required: true,
  },
  reservedSeats: [
    {
      seatNumber: {
        type: String,
        required: true,
      },
      reservedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

// Indexing
ReservedSeatschema.index(
  {
    movieName: 1,
    location: 1,
    timing: 1,
    'hallName.name': 1,
    'hallName.seats': 1,
    day: 1,
    date: 1,
    month: 1,
    'reservedSeats.seatNumber': 1,
  },
  { unique: true }
);

module.exports = mongoose.model('ReservedSeat', ReservedSeatschema);
