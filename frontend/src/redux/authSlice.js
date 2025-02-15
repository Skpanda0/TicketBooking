// Import createSlice from Redux Toolkit to create a slice of the Redux store
import { createSlice } from '@reduxjs/toolkit';

// Initial state for authentication slice
const initialState = {
  // Check if userId exists in localStorage, if yes, set isLoggedIn to true
  // Otherwise, set it to false
  isLoggedIn: Boolean(localStorage.getItem('userId')), 

  // Safely retrieve userId from localStorage, default to null if not found
  userId: localStorage.getItem('userId') || null, 
};

// Create the authentication slice using Redux Toolkit
const authSlice = createSlice({
  name: 'auth', // Name of the slice
  initialState, // Set the initial state defined above
  reducers: {
    // Login action to set user as logged in
    login(state, action) {
      state.isLoggedIn = true; // Set logged in state to true
      state.userId = action.payload.userId; // Update userId from action payload
      // console.log(state.userId); // Debugging log to check userId value

      // If userId exists, save it to localStorage
      if (state.userId) {
        localStorage.setItem('userId', state.userId); 
      }
    },

    // Logout action to reset authentication state
    logout(state) {
      state.isLoggedIn = false; // Set logged in state to false
      state.userId = null; // Reset userId to null
      localStorage.removeItem('userId'); // Remove userId from localStorage
    },
  },
});

// Export the login and logout actions for use in other parts of the app
export const { login, logout } = authSlice.actions;

// Export the reducer to be used in the store
export default authSlice.reducer;
