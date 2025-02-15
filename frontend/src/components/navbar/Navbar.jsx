import React, { useState, useEffect, useRef } from "react";
import logo from "../../assets/logo.jpg";
import Mumbai from "../../assets/mumbai.png";
import Hyderabad from "../../assets/hyd.png";
import Bengaluru from "../../assets/bang.png";
import Delhi from "../../assets/ncr.png";
import Berhampur from "../../assets/pune.png";
import user from "../../assets/user.png"

import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/authSlice";
import { addMovie } from "../../redux/movieDataSlice";
import { FaLocationDot } from "react-icons/fa6";
import { FaRegUserCircle } from "react-icons/fa";

// Navbar component, responsible for search, city selection, and user account features
const Navbar = ({ onSearch, onCity, locationButtonRef }) => {
  const [searchValue, setSearchValue] = useState(""); // State to track search input value
  const [showDropdown, setShowDropdown] = useState(false); // State to toggle city dropdown visibility
  const [showAccount, setShowAccount] = useState(false); // State to toggle account dropdown visibility
  const [cities, setCities] = useState([ // List of cities for dropdown
    "Mumbai",
    "Delhi",
    "Bengaluru",
    "Hyderabad",
    "Berhampur",
  ]);
  const [activeCity, setActiveCity] = useState(''); // State to track selected city

  // Mapping cities to respective images
  const cityImg = {
    Mumbai: Mumbai,
    Delhi: Delhi,
    Bengaluru: Bengaluru,
    Hyderabad: Hyderabad,
    Berhampur: Berhampur,
  };

  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn); // Check if the user is logged in
  const userId = useSelector((state) => state.auth.userId); // Get user ID from Redux state
  const navigate = useNavigate();

  // Toggle city dropdown visibility
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown); // Toggle the dropdown visibility
    setShowAccount(false); // Close account dropdown if open
  };

  // Handle search input change and pass it to the parent component
  const handleSearchChange = (e) => {
    setSearchValue(e.target.value); // Update the search value in the state
    onSearch(e.target.value); // Pass search value to parent component
  };

  // Handle city selection and update active city
  const handleCity = (city) => {
    setActiveCity(city); // Set the selected city
    onCity(city); // Pass the selected city to the parent component
    // dispatch(addMovie({ location: city, })); // Optional: add the city data to the Redux store (commented out)
    setShowDropdown(false); // Close the dropdown after city selection
    // console.log(city); // Log the selected city (commented out)
  };

  return (
    <div className="md:w-[100%] flex md:justify-between justify-center p-2 sm:ml-0 ml-0">
      {/* Left side - Logo and Search */}
      <div className="flex w-full sm:gap-5 gap-1 items-center">
        {/* Logo */}
        <div className="w-14 h-15 cursor-pointer">
          <img
            onClick={() => {
              // Redirect to the home page or user-specific page based on login status
              isLoggedIn
                ? navigate(`/home/${userId}`)
                : navigate("/"); // Navigate to home or user page
            }}
            className="rounded-xl hover:cursor-pointer"
            src={logo}
            alt="logo"
          />
        </div>
        {/* Search Input */}
        <div className="md:w-[80%] w-[35%]">
          <input
            className="focus:outline-none focus:ring-2 focus:ring-red-500 border border-gray-300 rounded-xl p-2 md:w-[80%] w-[80%] min-w-20"
            type="text"
            placeholder="Search"
            value={searchValue}
            onChange={handleSearchChange} // Update the search value on input change
          />
        </div>
      </div>

      {/* Right side - Location and User Account */}
      <div className="flex sm:gap-3 gap-1 justify-center items-center md:w-1/5 sm:mr-9 mr-2">
        {/* Location Dropdown */}
        <div>
          <div className="relative bg-gray-800 text-white flex justify-between items-center rounded-full">
            {/* Dropdown Trigger */}
            <div className="relative">
              <div className="hover:bg-red-600 hover:text-white hover:rounded-xl">
                <button
                  ref={locationButtonRef}
                  onClick={toggleDropdown} // Toggle location dropdown visibility
                  className="px-3 py-2 bg-white text-black overflow-hidden min-w-[90px] h-[33px] flex items-center justify-center gap-2"
                >
                  <FaLocationDot className="h-10" />
                  {activeCity === '' ? "Location" : activeCity} {/* Display active city or "location" */}
                </button>
              </div>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute top-full mt-3 right-0 sm:w-96 w-[250px] bg-white text-black shadow-2xl rounded-lg p-4 z-50 border-[3px] border-gray-200 ">
                  {/* Popular Cities Section */}
                  <div>
                    <h3 className="font-semibold mb-2">Popular Cities</h3>
                    <div className="grid grid-cols-2 gap-4 mt-3">
                      {cities.map((city) => (
                        <button
                          onClick={() => handleCity(city)} // Select city from dropdown
                          key={city}
                          className={`flex flex-col items-center text-sm ${activeCity === city ? 'text-red-500' : 'text-gray-700'} hover:text-red-500`}
                        >
                          {/* City Icon */}
                          <div className="w-10 h-10 bg-gray-200 rounded-full mb-2">
                            <img className="bg-red-500" src={cityImg[city]} alt={city} />
                          </div>
                          {city}
                        </button>
                      ))}
                    </div>
                    <div className="flex justify-center items-center">
                      <button
                        className="border border-transparent hover:border-red-500 px-2 py-1 rounded-lg"
                        onClick={() => { setShowDropdown(!showDropdown) }} // Close the dropdown
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Account Section */}
        <div className="">
          {isLoggedIn ? (
            <div className="flex">
              <button
                className="flex items-center gap-2"
                onClick={() => {
                  setShowAccount(!showAccount); // Toggle account dropdown visibility
                  setShowDropdown(false); // Close city dropdown if open
                }}
              >
                <FaRegUserCircle className="w-6 h-fit cursor-pointer" />
                <span>User</span>
              </button>

              {showAccount && (
                <div className="absolute top-14 mt-2 right-2 overflow-hidden w-44 h-fit bg-white text-black shadow-xl rounded-lg p-4 z-50 flex flex-col gap-2 border-[3px] border-gray-200">
                  {/* Account Menu */}
                  <div className="hover:text-red-500">
                    <Link to={`/${userId}/order`} onClick={() => setShowAccount(false)}>
                      Your Orders
                    </Link>
                  </div>
                  <div className="hover:text-red-500">
                    <Link to={`/${userId}/help`} onClick={() => setShowAccount(false)}>
                      Help & Support
                    </Link>
                  </div>
                  <div className="flex justify-center items-center my-2">
                    <button
                      className="border border-transparent bg-red-500 hover:bg-red-600 rounded-lg text-white py-1 px-2"
                      onClick={() => {
                        dispatch(logout()); // Logout the user
                        navigate('/'); // Navigate to home page after logout
                      }}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to={"/login"}>
              <button className="hover:bg-gray-900 hover:text-white rounded-xl font-bold p-2 transition-[.6s]">Login</button> {/* Show login button if the user is not logged in */}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
