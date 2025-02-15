const mongoose = require('mongoose');

// Define the user schema
const UserSchema = new mongoose.Schema({
    email: { 
        type: String, 
        unique: true, 
        sparse: true, // Allows null values, but ensures email is unique if provided
        match: [/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, 'Please enter a valid email address'], // Basic email validation
    },
    phone: {
        type: String,
        unique: true,
        sparse: true, // Allows null values, but ensures phone is unique if provided
        default: undefined, // Ensure phone number is null by default
        validate: {
            validator: function(v) {
                return v ? /^[+]?[0-9]{10,15}$/.test(v) : true; // Validate only if phone number is provided
            },
            message: 'Phone number must be a valid number (with or without country code)',
        },
    },
    
    otp: {
        type: String, // OTP as a string to accommodate any possible format
    },
    otpExpires: {
        type: Date, // Expiry date for OTP
    },
    bookings: [
        {
          movieName: { type: String, required: true },
          location: { type: String, required: true },
          timing: { type: String, required: true },
          hallName: {
            name: { type: String, required: true }, // Nested name field
            seats: { type: Number, required: true }, // Nested seats field
          },
          date: { type: String, required: true },
          month: { type: String, required: true },
          seats: [{ type: Number, required: true }],
          bookingtime: {type: String, required: true},
        }
      ]
      
    
});

// Ensuring at least one of `email` or `phone` is provided before user creation
UserSchema.pre('save', function(next) {
    if (!this.email && !this.phone) {
        next(new Error('Either email or phone number must be provided.'));
    } else {
        next();
    }
});

module.exports = mongoose.model('User', UserSchema);
