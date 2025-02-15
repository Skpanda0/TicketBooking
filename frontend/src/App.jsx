// Import necessary hooks and components from React and React Router
import { useState, useRef, useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import './App.css'; // Import global styles
import Home from './components/home/Home'; // Home component
import Login from './components/login/Login'; // Login component
import Navbar from './components/navbar/Navbar'; // Navbar component
import Order from './components/user-dropdown/Order'; // Order component
import HelpSupport from './components/user-dropdown/HelpSupport'; // Help & Support component
import Movie from './components/movie/Movie'; // Movie details component
import Booking from './components/booking/Booking'; // Booking component
import Seat from './components/booking/Seat'; // Seat selection component
import Footer from './components/footer/Footer'; // Footer component

function App() {
  // State variables to manage search value and selected city
  const [searchValue, setSearchValue] = useState(""); // Tracks search input
  const [city, setCity] = useState(""); // Tracks selected city for filtering movies
  
  // Reference for location button (used to control dropdown)
  const locationButtonRef = useRef(null);
  
  // Variable to store the user ID (fetched from localStorage)
  let userId;
  
  // Fetch the user ID from localStorage when the component mounts
  useEffect(() => {
    userId = localStorage.getItem('userId'); // Retrieve user ID from localStorage
  },[]);

  // Define the routes for the application using createBrowserRouter from React Router v6
  const router = createBrowserRouter([
    {
      // Route for the homepage (default route)
      path: '/',
      element: userId ? (
        <Navigate to={`/home/${userId}`} /> // Redirect to user-specific homepage if logged in
      ) : (
        // Render homepage if not logged in
        <div>
          <Navbar onSearch={setSearchValue} onCity={setCity} locationButtonRef={locationButtonRef} />
          <Home searchValue={searchValue} city={city} locationButtonRef={locationButtonRef} />
          <Footer />
        </div>
      ),
      index: true, // This route is the default one when visiting the root URL
    },
    {
      // Route for user-specific homepage, accessible by user ID
      path: "/home/:id",
      element: (
        <div>
          <Navbar onSearch={setSearchValue} onCity={setCity} locationButtonRef={locationButtonRef} />
          <Home searchValue={searchValue} city={city} locationButtonRef={locationButtonRef} />
          <Footer />
        </div>
      ),
    },
    {
      // Login page route
      path: "/login",
      element: (
        <div>
          <Login />
        </div>
      ),
    },
    {
      // Order page, accessible by user ID
      path: "/:id/order",
      element: (
        <div>
          <Navbar locationButtonRef={locationButtonRef} />
          <Order />
          <Footer />
        </div>
      ),
    },
    {
      // Help & Support page, accessible by user ID
      path: "/:id/help",
      element: (
        <div>
          <Navbar locationButtonRef={locationButtonRef} />
          <HelpSupport />
          <Footer />
        </div>
      ),
    },
    {
      // Movie details page, where a movie is displayed based on its name
      path: "/movie/:movieName",
      element: (
        <div>
          <Navbar locationButtonRef={locationButtonRef} city={city} />
          <Movie locationButtonRef={locationButtonRef} city={city} onCity={setCity} />
          <Footer />
        </div>
      ),
    },
    {
      // Movie details page with city parameter, used to filter based on city
      path: "/movie/:movieName/:city",
      element: (
        <div>
          <Navbar locationButtonRef={locationButtonRef} city={city} />
          <Movie locationButtonRef={locationButtonRef} cityName={city} onCity={setCity} />
          <Footer />
        </div>
      ),
    },
    {
      // Booking page for a specific movie in a selected city
      path: "/movie/:movieName/:city/booking",
      element: (
        <div>
          <Navbar locationButtonRef={locationButtonRef} />
          <Booking />
          <Footer />
        </div>
      ),
    },
    {
      // Seat selection page, part of the booking process
      path: "/movie/:movieName/:city/booking/seat",
      element: (
        <div>
          <Seat />
        </div>
      ),
    },
  ]);

  // Render the RouterProvider with the defined routes
  return (
    <>
      {/* Render the RouterProvider component to handle routing */}
      <RouterProvider router={router} />
    </>
  );
}

export default App;
