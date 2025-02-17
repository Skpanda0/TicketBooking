const express = require('express');
const User = require('../models/user'); // Import the User model
const app = express();
const router = express.Router();

router.get('/api/boke', (req, res) => {
    res.send("hello from book")
  })

router.get('/api/user-bookings/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ bookings: user.bookings });
    } catch (error) {
        console.error('Error fetching user bookings:', error);
        res.status(500).json({ message: 'Error fetching user bookings', error: error.message });
    }
});

module.exports = router;
