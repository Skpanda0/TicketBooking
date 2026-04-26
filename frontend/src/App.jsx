// Import necessary hooks and components from React and React Router
import { useRef, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
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
  const userId = useSelector((state) => state.auth.userId);

  const homePage = (
    <div>
      <Navbar onSearch={setSearchValue} onCity={setCity} locationButtonRef={locationButtonRef} city={city} />
      <Home searchValue={searchValue} city={city} locationButtonRef={locationButtonRef} />
      <Footer />
    </div>
  );

  const pageWithNavbar = (content) => (
    <div>
      <Navbar onCity={setCity} locationButtonRef={locationButtonRef} city={city} />
      {content}
      <Footer />
    </div>
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={userId ? <Navigate to={`/home/${userId}`} replace /> : homePage} />
        <Route path="/home/:id" element={homePage} />
        <Route path="/login" element={<Login />} />
        <Route path="/:id/order" element={pageWithNavbar(<Order />)} />
        <Route path="/:id/help" element={pageWithNavbar(<HelpSupport />)} />
        <Route path="/movie/:movieName" element={pageWithNavbar(<Movie onCity={setCity} cityName={city} />)} />
        <Route path="/movie/:movieName/:city" element={pageWithNavbar(<Movie onCity={setCity} cityName={city} />)} />
        <Route path="/movie/:movieName/:city/booking" element={pageWithNavbar(<Booking />)} />
        <Route path="/movie/:movieName/:city/booking/seat" element={<Seat />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
