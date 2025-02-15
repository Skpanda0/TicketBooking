// This file manages the Redux slice for storing movie-related data and location information

import { createSlice } from '@reduxjs/toolkit'

// Initial state for movie data slice
const initialState = {
  movieInfo: null,  // Stores detailed information about the movie (e.g., title, description, etc.)
  location: '',     // Stores the location related to the movie (e.g., city or cinema)
}

// Create the Redux slice for managing movie-related state
export const movieDataSlice = createSlice({
  name: 'moveData',  // Name of the slice
  initialState,      // Initial state
  reducers: {
    // Reducer to add movie data and location to the state
    addMovie: (state, action) => {
      state.movieInfo = action.payload.info;  // Set movie information in the state
      state.location = action.payload.location; // Set location information in the state
    },
  },
})

// Action creators are automatically generated for each case reducer function
export const { addMovie } = movieDataSlice.actions  // Export the addMovie action creator

// Export the reducer function to be used in the Redux store
export default movieDataSlice.reducer
