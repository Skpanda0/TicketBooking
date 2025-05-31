import React, { useEffect, useState } from "react";  // Importing necessary React hooks
import axios from "axios";  // Importing axios for making HTTP requests
import { useSelector } from "react-redux";  // Importing useSelector to access Redux state
import toast from "react-hot-toast";  // Importing toast for showing notifications

const Order = () => {
  const [bookings, setBookings] = useState([]);  // State to hold the user's bookings
  const userId = useSelector((state) => state.auth.userId);  // Retrieving userId from Redux store (assuming it is stored there)
  const movies = useSelector((state) => state.movies.movies);  // Retrieving list of movies from Redux store

  // useEffect to fetch the user's bookings when the component mounts or when userId changes
  useEffect(() => {
    const loadingToastId = toast.loading("Loading...");
    const fetchUserBookings = async () => {
      try {
        // Making an API call to get the bookings of the current user
        const response = await axios.get(
          `${process.env.PUBLIC_BASE_URL}/api/user-bookings/${userId}`
        );
        if (response.status === 200) {
          // console.log(response.data);  // Log the fetched data for debugging
          toast.dismiss(loadingToastId);  // Dismiss the loading toast
          setBookings(response.data.bookings);  // Set the fetched bookings data in state
        } else {
          toast.error("Failed to fetch booking details", { id: loadingToastId });  // Show error if the API call fails
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);  // Log any errors that occur during the fetch
        toast.error("Error fetching booking details" ,{ id: loadingToastId });  // Show error toast on fetch failure
      }
    };

    // Fetch bookings if userId exists
    if (userId) {
      fetchUserBookings();  // Call the function to fetch user bookings
    }
  }, [userId]);  // Effect dependency on userId, so it triggers when userId changes

  return (
    <div className="border-t-2 mt-2 min-h-[100vh]">
      {/* Heading for the page */}
      <h1 className="text-center mt-3 font-semibold text-3xl text-slate-800">
        All booked movies
      </h1>
      {/* Check if there are no bookings, display a message */}
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div className="my-4 mx-10 rounded-xl p-4 flex flex-col gap-4">
          {/* Map through the bookings and display each booking */}
          {bookings.map((booking, index) => {
            // Find the corresponding movie details for each booking
            const movieDetails = movies.find(
              (movie) => movie.Title === booking.movieName
            );

            return (
              <div
                key={index}  // Unique key for each booking
                className="p-2 gap-5 border-2 rounded-lg shadow-md bg-white flex flex-wrap transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <div>
                  {/* Display movie poster if movie details are available */}
                  {movieDetails && (
                    <img
                      src={movieDetails.Poster}  // Movie poster URL
                      alt={`${booking.movieName} poster`}  // Alt text for the poster
                      className="h-32 object-cover rounded-md mt-2"
                    />
                  )}
                </div>
                <div className="flex flex-col space-y-1">
                  {/* Display the movie name and genre */}
                  <h2 className="text-lg font-semibold">{booking.movieName} ({movieDetails?.Genre})</h2>
                  {/* Display the movie language */}
                  <p className="font-thin text-sm">({movieDetails?.Language})</p>
                  {/* Display the booking date, time, and other relevant details */}
                  <p className="font-[400] text-sm">
                    {booking.day} {booking.date} {booking.month} |{" "}
                    {booking.timing}
                  </p>
                  {/* Display the hall name */}
                  <p className="font-[400] ">{booking.hallName.name}</p>
                  {/* Display the seats and the number of tickets */}
                  <p className="font-[400]">
                    Seats: {booking.seats.join(", ")} ({booking.seats.length} Tickets)
                  </p>
                  {/* Display the time the booking was made */}
                  <p className="font-[300]">Booked at: {booking.bookingtime}</p>
                  {/* Display the total amount for the booking */}
                  <p className="font-[400]">
                    Total amount: {150 * booking.seats.length} rs
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Order;  // Export the Order component to be used elsewhere in the application
