// Import necessary functions from Redux Toolkit
import { createSlice } from '@reduxjs/toolkit';

// Initial state of the seat slice, including movie details, timing, and reserved seat info
const initialState = {
  movieName: null,      // Stores the movie name
  location: null,       // Stores the movie location
  timing: null,         // Stores the timing of the movie
  hallName: null,       // Stores the hall name
  day: null,            // Stores the day of the booking
  date: null,           // Stores the date of the booking
  month: null,          // Stores the month of the booking
  seats: [],            // Array to store all available seats
  reservedSeats: [],    // Array to store reserved seats
  id: null,             // Stores the ID of the booking (if applicable)
};

// Create a slice for managing seat booking data
export const seatSlice = createSlice({
  name: 'seat',         // Name of the slice
  initialState,         // Set the initial state
  reducers: {
    // Reducer to store booking data (movie, location, etc.)
    bookData: (state, action) => {
      state.movieName = action.payload.name;   // Store the movie name from the action payload
      state.location = action.payload.location; // Store the location
      state.timing = action.payload.timing;     // Store the timing
      state.hallName = action.payload.hallName; // Store the hall name
      state.day = action.payload.day;           // Store the day of the booking
      state.date = action.payload.date;         // Store the date of the booking
      state.month = action.payload.month;       // Store the month of the booking
      state.seats = action.payload.seats;       // Store the list of seats
    },

    // Reducer to update the reserved seats with new data
    updateReservedSeats: (state, action) => {
      state.reservedSeats = action.payload;  // Update reservedSeats with the new data from the action payload
    },

    // Reducer to clear all seat-related data when the booking process is reset
    clearSeats: (state) => {
      state.movieName = null;       // Reset movie name
      state.location = null;        // Reset location
      state.timing = null;          // Reset timing
      state.hallName = null;        // Reset hall name
      state.day = null;             // Reset day
      state.date = null;            // Reset date
      state.month = null;           // Reset month
      state.seats = [];             // Clear all seats
      state.reservedSeats = [];     // Clear all reserved seats
    },
  },
});

// Export action creators for each case reducer function
export const { bookData, updateReservedSeats, clearSeats } = seatSlice.actions;

// Export the reducer to be used in the Redux store
export default seatSlice.reducer;
