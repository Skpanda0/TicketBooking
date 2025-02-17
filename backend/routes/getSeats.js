const express = require('express');
const ReservedSeat = require('../models/reservedseat');
const { default: mongoose } = require('mongoose');

const router = express.Router();

router.get('/api/getseat', (req, res) => {
  res.send("hello from getseats")
})

router.post('/api/get-reserved-seats', async (req, res) => {
  const { movieName, location, timing, hallName, day, date, month } = req.body;

  try {
    // Query the database for all reservations matching the provided details
    const reservations = await ReservedSeat.find({
      movieName,
      location,
      timing,
      'hallName.name': hallName.name, // Match hall name
      day,
      date,
      month,
    });

    if (!reservations || reservations.length === 0) {
      return res.status(200).json({ reservedSeats: [] }); // No reservations found
    }

    // Consolidate all reserved seats across documents
    const allReservedSeats = reservations
      .map((reservation) => reservation.reservedSeats)
      .flat(); // Flatten to get a single array of reserved seats

    res.status(200).json({ reservedSeats: allReservedSeats });
  } catch (error) {
    console.error('Error fetching reserved seats:', error);
    res.status(500).json({ message: 'Error fetching reserved seats', error: error.message });
  }
});

module.exports = router;