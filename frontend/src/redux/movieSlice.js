// Import necessary functions from Redux Toolkit
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { MOVIE_TITLES } from "../constants/cities";

// Async thunk to fetch movies from OMDB API
export const fetchMovies = createAsyncThunk("movies/fetchMovies", async (_, { rejectWithValue }) => {
  const apiKey = import.meta.env.VITE_API_KEY;  // API key for OMDB API

  if (!apiKey) {
    return rejectWithValue("OMDB API key is missing");
  }

  try {
    // Fetch data for all movie titles in parallel using Promise.all
    const fetchedMovies = await Promise.all(
      MOVIE_TITLES.map(async (title) => {
        const response = await fetch(
          `https://www.omdbapi.com/?apikey=${apiKey}&t=${encodeURIComponent(title)}`
        );
        return response.json(); // Return the parsed JSON response for each movie
      })
    );
    return fetchedMovies.filter((movie) => movie?.Response !== "False" && movie?.Title); // Return only usable movie data
  } catch {
    return rejectWithValue("Failed to fetch movies");  // Return a failure message in case of an error
  }
});

// Create the movie slice
const movieSlice = createSlice({
  name: "movies",  // Name of the slice
  initialState: {
    movies: [],  // Array to store fetched movie data
    loading: false,  // Boolean flag to indicate loading state
    error: null,  // Stores any error message that occurs during fetching
  },
  reducers: {},  // No reducers are needed for this slice as we are only handling async actions
  extraReducers: (builder) => {
    builder
      // When fetching movies is pending, set loading to true and reset error state
      .addCase(fetchMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // When fetching movies is fulfilled, set the fetched movies and reset loading state
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.movies = action.payload;
      })
      // When fetching movies fails, set loading to false and store the error message
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export the reducer to be used in the Redux store
export default movieSlice.reducer;
