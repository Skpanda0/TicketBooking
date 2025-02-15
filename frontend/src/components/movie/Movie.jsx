import React, { useState } from "react"; // Import necessary React hooks
import { useSelector } from "react-redux"; // Import Redux hook to access the store
import { useNavigate, useParams } from "react-router-dom"; // Import navigation hooks from React Router
import { toast } from "react-hot-toast"; // Import toast for notifications
import { Pen } from "lucide-react"; // Import Pen icon from lucide-react for editing
import SpotlightCard from "../ui/SpotlightCard"; // Import custom SpotlightCard component
import ReviewCard from "./ReviewCard"; 
import Mumbai from "../../assets/mumbai.png"; // Import city images
import Hyderabad from "../../assets/hyd.png";
import Bengaluru from "../../assets/bang.png";
import Delhi from "../../assets/ncr.png";
import Berhampur from "../../assets/pune.png";

const Movie = ({ cityName, onCity }) => {
  // Fetch movie information from the Redux store
  const info = useSelector((state) => state.movieData.movieInfo);

  // Get navigation function from React Router
  const navigate = useNavigate();

  // Calculate the movie runtime (hours and minutes format)
  const runtime = `${Math.floor(Number.parseInt(info.Runtime) / 60)}hr ${Number.parseInt(info.Runtime) % 60}min`;

  // Destructure movie name and city from URL params
  const { movieName, city } = useParams();

  // State for managing popups
  const [showPopup, setShowPopup] = useState(false); // Popup for movie location
  const [locationPopup, setLocationPopup] = useState(false); // Popup for city selection

  // List of cities and corresponding images for location selection
  const cities = ["Mumbai", "Delhi", "Bengaluru", "Hyderabad", "Berhampur"];
  const cityImg = {
    Mumbai: Mumbai,
    Delhi: Delhi,
    Bengaluru: Bengaluru,
    Hyderabad: Hyderabad,
    Berhampur: Berhampur,
  };

  // Movies available in each city
  const cityMovies = {
    Delhi: ["Pushpa: The Rule - Part 2", "RRR", "The Batman", "Vanvaas", "Jailer"],
    Bengaluru: ["Pushpa: The Rule - Part 2", "Mufasa: The Lion King", "Jailer"],
    Hyderabad: ["Pushpa: The Rule - Part 2", "Vanvaas", "Marco", "Solo Leveling: ReAwakening"],
    Mumbai: [
      "RRR",
      "The Batman",
      "Pushpa: The Rule - Part 2",
      "Demon Slayer: Kimetsu no Yaiba - The Movie: Mugen Train",
      "Jujutsu Kaisen 0",
      "Jailer",
      "Vanvaas",
    ],
    Berhampur: ["RRR", "Pushpa: The Rule - Part 2", "Daman", "Jailer"],
  };

  // Function to close the initial popup
  const handlePopupClose = () => {
    setShowPopup(false);
  };

  // Function to show location popup
  const handleLocationClick = () => {
    setLocationPopup(true);
  };

  // Function to handle city selection and navigate to the booking page if movie is available
  const handelCity = (cityname) => {
    onCity(cityname); // Pass selected city back to the parent component
    const movieAvailable = cityMovies[cityname]?.includes(movieName); // Check if the movie exists in the selected city

    if (movieAvailable) {
      // Navigate to booking page if movie is available in the selected city
      navigate(`/movie/${movieName}/${cityname}/booking`);
    } else {
      // Show a toast notification if movie is not available in the selected city
      toast((t) => (
        <span>
          {`${movieName} is not available in ${cityname}.`} 
          <button
            className="ml-2 px-1.5 py-1 bg-red-500 text-white rounded-xl hover:bg-red-600 overflow-hidden" 
            onClick={() => toast.dismiss(t.id)} // Dismiss the toast notification when button is clicked
          >
            okay
          </button>
        </span>
      ));
    }

    // Close popups after city selection
    setLocationPopup(false);
    setShowPopup(false);
  };

  return (
    <div className="m-2">
      <div className="relative  m-2 border-2 border-gray-200 rounded-3xl overflow-hidden shadow-xl">
        {/* Background Image with Blur */}
        <div
          className="absolute inset-0 bg-cover bg-center m-2"
          style={{
            backgroundImage: `url(${info.Poster})`, // Set background image to movie poster
            filter: "blur(8px)", // Apply blur effect to background
            zIndex: -1, // Ensure the background is behind the content
          }}
        ></div>

        {/* Movie Content */}
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 px-8 py-16">
          {/* Movie Poster */}
          <div className="flex-shrink-0">
            <img
              className="rounded-3xl shadow-lg w-[320px] h-[450px] object-cover transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
              src={info.Poster} // Set the movie poster image
              alt={info.Title} // Set movie title as alt text
            />
          </div>

          {/* Movie Details */}
          <div className="text-left max-w-2xl text-slate-300">
            <h1 className="text-4xl font-bold mb-4">{info.Title}</h1> {/* Movie Title */}
            <p className="text-xl mb-2">
              <span className="font-semibold">IMDb Rating:</span>{" "}
              {info.imdbRating} ({info.imdbVotes} votes)
            </p>
            <p className="text-lg mb-2">
              <span className="font-semibold">Genre:</span> {info.Genre}
            </p>
            <p className="text-lg mb-2">
              <span className="font-semibold">Language:</span> {info.Language}
            </p>
            <p className="text-lg mb-2">
              <span className="font-semibold">Released:</span> {info.Released}
            </p>
            <p className="text-lg mb-4">
              <span className="font-semibold">Runtime:</span> {runtime} {/* Show runtime in hours and minutes */}
            </p>

            {/* Booking button based on whether cityName is provided */}
            {cityName ? (
              <button
                onClick={() => navigate(`/movie/${movieName}/${city}/booking`)}
                className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition"
              >
                Book Now
              </button>
            ) : (
              <button
                onClick={() => setShowPopup(true)} // Open popup for location if no city is selected
                className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition"
              >
                location
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Spotlight Card with more movie details */}
      <SpotlightCard
        className="text-left m-2 mt-4 border border-gray-300 shadow-lg"
        spotlightColor="rgba(228, 142, 112, 0.4)"
      >
        <h2 className="text-xl font-bold mb-4">More about the movie</h2>
        <p className="text-lg mb-4">
          <span className="font-semibold">Plot:</span> {info.Plot}
        </p>
        <p className="text-lg mb-4">
          <span className="font-semibold">Director:</span> {info.Director}
        </p>
        <p className="text-lg mb-4">
          <span className="font-semibold">Actors:</span> {info.Actors}
        </p>
        <p className="text-lg mb-4">
          <span className="font-semibold">Writer:</span> {info.Writer}
        </p>
      </SpotlightCard>

      {/* Review Section */}
      <div className="p-6 text-left m-2 mt-4 border border-gray-300 shadow-lg rounded-xl">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold mb-4">Top reviews</h2>
          <button className="mb-4 hover:bg-red-600">
            <Pen size={24} className="text-red-500" /> {/* Edit icon button */}
          </button>
        </div>

        {/* Display Review Cards */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <ReviewCard actor={info.Actors} detail={`lived in the Character ❤️ Everyone acted very well. Climax just gave goosebumps 🔥 What an energy 🔥 Blockbuster Movie 🎥`} name={"Sunil"} />
          <ReviewCard actor={info.Actors} detail={`lived in the Character ❤️ Everyone acted very well. Climax just gave goosebumps 🔥 What an energy 🔥 Blockbuster Movie 🎥`} name={"Duti"} />
          <ReviewCard actor={info.Actors} detail={`Blockbuster Movie 🎥`} name={"Rohit"} />
        </div>
      </div>

      {/* Popups for location */}
      {showPopup && (
        <div className="absolute inset-0 top-20 sm:top-0 bottom-[-95px] pt-96 sm:pt-0 bg-black bg-opacity-50 flex justify-center items-center z-50 backdrop-filter backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg p-6 sm:w-96 w-80 h-fit">
            <h3 className="text-lg font-semibold mb-4">
              Give your location for checking availability
            </h3>
            <div className="flex justify-between">
              <button
                onClick={handlePopupClose} // Close the location popup
                className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Stay
              </button>
              <button
                onClick={handleLocationClick} // Open location selection popup
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                location
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Location selection popup */}
      {locationPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 backdrop-filter backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h3 className="font-semibold mb-2">Popular Cities</h3>
            <div className="grid grid-cols-2 gap-4 mt-3">
              {cities.map((city) => (
                <button
                  onClick={() => handelCity(city)} // Handle city selection
                  key={city}
                  className={`flex flex-col items-center text-sm  hover:text-red-500`}
                >
                  <div className="w-10 h-10 bg-gray-200 rounded-full mb-2">
                    <img className="bg-red-500" src={cityImg[city]} alt={city} /> {/* Display city image */}
                  </div>
                  {city} {/* Display city name */}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Movie;
