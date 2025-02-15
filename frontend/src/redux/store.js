// Import the necessary functions from Redux Toolkit
import { configureStore } from '@reduxjs/toolkit';

// Import the reducers for each slice (authentication, movie data, movie details, booking, and seat)
import authReducer from './authSlice';
import movieDataReducer from './movieDataSlice';
import movieReducer from './movieSlice';
import bookingReducer from './bookingSlice';
import seatReducer from './seatSlice';

// Configure the Redux store
const store = configureStore({
  reducer: {
    // Map each slice's reducer to a key in the state
    auth: authReducer,             // Auth slice for managing user login/logout state
    movieData: movieDataReducer,   // Movie data slice for managing selected movie and location info
    movies: movieReducer,          // Movies slice for fetching and storing movie details
    booking: bookingReducer,       // Booking slice for handling booking info like hall, movie, and seat
    seat: seatReducer,             // Seat slice for handling seat selection and reservation data
  },
});

// Export the configured store for use in the application
export default store;
