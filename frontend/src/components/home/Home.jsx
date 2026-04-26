import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Mousewheel, Zoom } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { addMovie } from "../../redux/movieDataSlice";
import { fetchMovies } from "../../redux/movieSlice";
import { CITY_MOVIES } from "../../constants/cities";

import "swiper/css";
import "swiper/css/navigation";

// Component to display the home page
const Home = ({ searchValue = "", city = "", locationButtonRef }) => {
  const [showPopup, setShowPopup] = useState(false); // State for controlling the popup visibility
  const [selectedMovie, setSelectedMovie] = useState(null); // State for storing the selected movie
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn); // Fetching login status from Redux
  const navigate = useNavigate(); // Navigate function for routing
  const dispatch = useDispatch(); // Dispatch function for triggering Redux actions
  const swiperRef = useRef(null); // Reference for the Swiper component
  const { movies, loading, error } = useSelector((state) => state.movies); // Fetching movie list from Redux

  // Fetch movies when the component mounts
  useEffect(() => {
    if (movies.length === 0 && !loading && !error) {
      const loadingToastId = toast.loading("Loading movies...");

      // Dispatch action to fetch movies from API or Redux store
      dispatch(fetchMovies())
        .unwrap()
        .then(() => {
          toast.dismiss(loadingToastId);
        })
        .catch(() => {
          toast.error("Failed to load movies.", { id: loadingToastId });
        });
    }
  }, [dispatch, error, loading, movies.length]); // Run when dispatch or movies change

  const validMovies = useMemo(
    () => movies.filter((movie) => movie?.Title && movie?.Poster && movie.Poster !== "N/A"),
    [movies]
  );

  // Filter movies based on the search value
  const filteredMovies = useMemo(
    () => validMovies.filter(
      (movie) => movie.Title.toLowerCase().includes(searchValue.toLowerCase()) // Case-insensitive filtering
    ),
    [searchValue, validMovies]
  );

  // Filter movies based on the selected city
  const citySpecificMovies = useMemo(
    () => city
      ? validMovies.filter((movie) => CITY_MOVIES[city]?.includes(movie.Title)) // Movies specific to the city
      : [],
    [city, validMovies]
  );

  // Handle movie click event when a user clicks on a movie
  const handleMovieClick = (movie) => {
    if (isLoggedIn) {
      // If logged in, add movie to the user's movie list
      dispatch(
        addMovie({
          info: movie,
          location: city,
        })
      );
      navigate(`/movie/${encodeURIComponent(movie.Title)}`); // Navigate to movie details page
    } else {
      setSelectedMovie(movie.Title); // Store selected movie title for later use
      setShowPopup(true); // Show login popup
    }
  };

  // Handle movie click event when a user clicks on a movie in a specific city
  const handleMovieClickCity = (movie) => {
    if (isLoggedIn) {
      // If logged in, add movie to the user's movie list for the city
      dispatch(
        addMovie({
          info: movie,
          location: city,
        })
      );
      navigate(`/movie/${encodeURIComponent(movie.Title)}/${city}`); // Navigate to movie details with city
    } else {
      setSelectedMovie(movie.Title); // Store selected movie title for later use
      setShowPopup(true); // Show login popup
    }
  };

  // Handle popup close event
  const handlePopupClose = () => {
    setShowPopup(false); // Close the popup
    setSelectedMovie(null); // Reset selected movie
  };

  // Handle login button click event to redirect to the login page
  const handleLoginClick = () => {
    navigate("/login"); // Navigate to login page
  };

  // Initialize Swiper navigation buttons
  useEffect(() => {
    if (swiperRef.current) {
      const swiper = swiperRef.current.swiper;
      swiper.params.navigation.prevEl = ".custom-prev";
      swiper.params.navigation.nextEl = ".custom-next";
      swiper.navigation.init();
      swiper.navigation.update();
    }
  }, []); // Initialize swiper navigation when component mounts

  return (
    <div className="min-h-[100vh]">
      
      {/* Movies Carousel */}
      <div className="movies-carousel relative p-4 m-2 border-t-2">
        <h2 className="text-xl font-bold mb-4 pl-4">Recommended Movies</h2>
        <Swiper
          ref={swiperRef}
          modules={[Navigation, Mousewheel, Zoom]} // Swiper modules for navigation, zoom and mousewheel
          zoom={true}
          mousewheel={true}
          spaceBetween={10}
          slidesPerView={1}
          breakpoints={{
            640: {
              slidesPerView: 1, // 1 slide per view for small screens
            },
            768: {
              slidesPerView: 3, // 3 slides per view for medium screens
            },
            1024: {
              slidesPerView: 4, // 4 slides per view for large screens
            },
          }}
          className="w-full"
        >
          {filteredMovies.map((movie) => (
            <SwiperSlide key={movie.imdbID}>
              <div
                className="flex flex-col items-center gap-2 w-full pt-4 p-2 cursor-pointer relative"
                onClick={() => handleMovieClick(movie)} // On movie click
               
              >

                <img
                  className={`rounded-xl shadow-lg w-[320px] h-[400px] object-cover transform transition-transform duration-300  hover:scale-105 hover:shadow-2xl`} 
                  src={movie.Poster}
                  alt={movie.Title}
                  loading="lazy"
                />
                <h3 className="pl-3 text-lg font-semibold text-left w-full">
                  {movie.Title}
                </h3>
                <p className="pl-3 text-sm text-gray-500 text-left w-full">
                  {movie.Genre}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        {/* Custom Navigation Buttons */}
        <button className="pl-2 custom-prev opacity-[0.5] hover:opacity-[0.8] text-slate-500 hover:text-red-500 transition-all duration-300 absolute top-1/2 left-4 -translate-y-1/2 z-10">
          <ChevronLeft size={50} />
        </button>
        <button className="pr-2 custom-next opacity-[0.5] hover:opacity-[0.8] text-slate-500 hover:text-red-500 transition-all duration-300 absolute top-1/2 right-4 -translate-y-1/2 z-10">
          <ChevronRight size={50} />
        </button>
      </div>

      {/* Movies in Your City */}
      <div className="p-4 m-2 border-y-2 pb-8 mb-8">
        {city ? (
          <>
            <h2 className="text-xl font-bold mb-4 pl-4">
              Movies in your city, {city}
            </h2>
            <Swiper
              modules={[Navigation, Mousewheel, Zoom]} // Swiper modules for navigation, zoom and mousewheel
              zoom={true}
              mousewheel={true}
              spaceBetween={10}
              slidesPerView={1}
              breakpoints={{
                640: {
                  slidesPerView: 1, // 1 slide per view for small screens
                },
                768: {
                  slidesPerView: 3, // 3 slides per view for medium screens
                },
                1024: {
                  slidesPerView: 4, // 4 slides per view for large screens
                },
              }}
              className="w-full"
            >
              {citySpecificMovies.map((movie) => (
                <SwiperSlide key={movie.imdbID}>
                  <div
                    className="flex flex-col items-center gap-2 w-full pt-4 p-2 cursor-pointer"
                    onClick={() => handleMovieClickCity(movie)} // On movie click
                  >
                    <img
                      className="rounded-xl shadow-lg w-[320px] h-[400px] object-cover transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
                      src={movie.Poster}
                      alt={movie.Title}
                      loading="lazy"
                    />
                    <h3 className="pl-3 text-lg font-semibold text-left w-full">
                      {movie.Title}
                    </h3>
                    <p className="pl-3 text-sm text-gray-500 text-left w-full">
                      {movie.Genre}
                    </p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold mb-4 pl-4">Movies in your city</h2>
            <p className="text-lg font-semibold pl-4">
              Select a city to view movies
              <span
                className="text-blue-500 cursor-pointer ml-2"
                onClick={() => {
                  // Scroll to the top of the page
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  // Trigger the location dropdown
                  setTimeout(() => {
                    if (locationButtonRef.current) {
                      locationButtonRef.current.click();
                    }
                  }, 500); // Adjust the timeout as needed
                }}
              >
                Click here
              </span>
            </p>
          </>
        )}
      </div>

      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 backdrop-filter backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">
              You need to log in to view details for &quot;{selectedMovie}&quot;.
            </h3>
            <div className="flex justify-between">
              <button
                onClick={handlePopupClose}
                className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Stay
              </button>
              <button
                onClick={handleLoginClick}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
