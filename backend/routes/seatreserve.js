const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const ReservedSeat = require('../models/reservedseat');
const User = require('../models/user'); // Assuming you have a User model

const router = express.Router();

router.get('/api/seatres', (req, res) => {
  res.send("hello from resseat")
})

const validateBookingDetails = (bookingDetails) => {
  if (
    !bookingDetails.hallName ||
    typeof bookingDetails.hallName !== 'object' ||
    !bookingDetails.hallName.name ||
    typeof bookingDetails.hallName.name !== 'string' ||
    !bookingDetails.hallName.seats ||
    typeof bookingDetails.hallName.seats !== 'number'
  ) {
    throw new Error('Invalid hallName format. Expected an object with name (string) and seats (number).');
  }
};

const razorpayInstance = new Razorpay({
  key_id: 'rzp_test_eWD6xZRsShtFEb', // Replace with your Razorpay Key ID
  key_secret: 'LsMXvaSaKAURbZGEKxEYEFw8', // Replace with your Razorpay Key Secret
});

router.post('/api/reserve-seats', async (req, res) => {
  const { movieName, location, timing, hallName, day, date, month, selectedSeats } = req.body;

  try {
    validateBookingDetails(req.body);

    const existingReservation = await ReservedSeat.findOne({
      movieName,
      location,
      timing,
      'hallName.name': hallName.name,
      day,
      date,
      month,
      'reservedSeats.seatNumber': { $in: selectedSeats },
    });

    if (existingReservation) {
      return res.status(400).json({ message: 'Some of the selected seats are already booked' });
    }

    const amount = 150 * selectedSeats.length * 100; // Amount in paise
    const razorpayOrder = await razorpayInstance.orders.create({
      amount,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    });

    res.status(200).json({
      message: 'Proceed to payment',
      orderId: razorpayOrder.id,
      amount,
      currency: 'INR',
      selectedSeats,
    });
  } catch (error) {
    console.error('Error in reserve-seats:', error);
    res.status(500).json({ message: error.message });
  }
});

router.post('/api/verify-payment', async (req, res) => {
  const { paymentResult, selectedSeats, id, ...bookingDetails } = req.body;
  // console.log(bookingDetails.bookingtime)
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentResult;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      console.error('Missing payment details:', paymentResult);
      return res.status(400).json({ message: 'Missing payment details' });
    }

    const generatedSignature = crypto
      .createHmac('sha256', 'LsMXvaSaKAURbZGEKxEYEFw8')
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      console.error('Invalid signature:', { generatedSignature, razorpay_signature });
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    // Update user bookings
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $push: { bookings: { ...bookingDetails, seats: selectedSeats } } },
      { new: true }
    );

    if (!updatedUser) {
      console.error('User not found for ID:', id);
      return res.status(404).json({ message: 'User not found' });
    }

    // Update ReservedSeat collection
    await ReservedSeat.findOneAndUpdate(
      {
        movieName: bookingDetails.movieName,
        location: bookingDetails.location,
        timing: bookingDetails.timing,
        'hallName.name': bookingDetails.hallName.name,
        day: bookingDetails.day,
        date: bookingDetails.date,
        month: bookingDetails.month,
      },
      {
        $push: {
          reservedSeats: {
            $each: selectedSeats.map((seat) => ({
              seatNumber: String(seat), // Ensure seatNumber is a string
            })),
          },
          bookingtime: bookingDetails.bookingtime,
        },
      },
      { upsert: true, new: true } // Create the document if it doesn't exist
    );
   
    if (!global.io) {
      console.error('⚠️ Socket.io instance not found!');
      return res.status(500).json({ message: 'Socket.io is not initialized' });
    }

    // Fetch updated reserved seats
    const allreservations = await ReservedSeat.find({
      movieName: bookingDetails.movieName,
      location: bookingDetails.location,
      timing: bookingDetails.timing,
      'hallName.name': bookingDetails.hallName.name,
      day: bookingDetails.day,
      date: bookingDetails.date,
      month: bookingDetails.month,
    });

    const reservedSeatsList = allreservations.map((res) => res.reservedSeats).flat();

    // Emit real-time update to all connected clients
    global.io.emit('seatUpdate', { reservedSeats: reservedSeatsList });

    res.status(200).json({
      message: 'Payment verified and seats booked',
      reservedSeats: reservedSeatsList,
      userBookings: updatedUser.bookings,
    });
  } catch (error) {
    console.error('Error in verify-payment route:', error.message, error.stack);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Payment verification failed', error: error.message });
    }
  }
});


module.exports = router;
