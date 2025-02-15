// Import necessary libraries and components
import { StrictMode } from 'react'; // React's StrictMode for development checks
import { createRoot } from 'react-dom/client'; // React 18's new root API
import './index.css'; // Import global CSS styles
import App from './App.jsx'; // Main application component

// Import Redux-related modules
import { Provider } from 'react-redux'; // Provider component to pass the Redux store to the app
import store from './redux/store'; // The Redux store object

// Import Toast notifications library
import { Toaster } from 'react-hot-toast'; // Toaster component for showing notifications

// Render the app to the DOM
createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* The Provider component makes the Redux store available to all components */}
    <Provider store={store}>
      {/* Main App component */}
      <App />

      {/* Toaster component for displaying toast notifications */}
      <Toaster />
    </Provider>
  </StrictMode>,
);
