import React from "react"; // Importing React
import user from "../../assets/user.png"; // Importing the default user image

const ReviewCard = ({ actor, detail, name }) => {
  return (
    <div className="max-w-sm mx-auto p-4 bg-white shadow rounded-lg">
      {/* User Information */}
      <div className="flex items-center mb-2">
        {/* User Avatar */}
        <div className="w-10 h-10 bg-gray-300 rounded-full">
          <img className="" src={user} alt="User Avatar" /> {/* Displaying user image */}
        </div>
        {/* User Name and Booking Information */}
        <div className="ml-3">
          <p className="font-semibold text-gray-800">{name}</p> {/* Displaying the name of the reviewer */}
          <p className="text-sm text-gray-500">
            Booked on <span className="text-red-500 font-semibold">movie booking</span> {/* Display booking information */}
          </p>
        </div>
      </div>

      {/* Rating Section */}
      <div className="flex items-center mb-3">
        <span className="text-pink-500 text-lg font-bold">★</span> {/* Rating Star */}
        <span className="ml-1 text-lg font-semibold text-gray-700">9/10</span> {/* Displaying the rating */}
      </div>

      {/* Hashtags Section */}
      <p className="text-sm text-gray-600 mb-2">
        <span className="font-semibold">#SuperDirection</span> {/* Hashtags related to the movie */}
        <span className="font-semibold">#GreatActing</span>
        <span className="font-semibold">#Blockbuster</span>
      </p>

      {/* Review Content Section */}
      <p className="text-gray-700 mb-3">
        {actor} {detail} {/* Displaying the review content with the actor and review detail */}
      </p>

      {/* Stats Section */}
      <div className="flex justify-between items-center text-sm text-gray-500">
        <div className="flex items-center">
          {/* Like Button */}
          <button className="flex items-center hover:text-gray-700">
            👍 <span className="ml-1">15.6K</span> {/* Displaying number of likes */}
          </button>
          {/* Dislike Button */}
          <button className="ml-4 flex items-center hover:text-gray-700">
            👎
          </button>
        </div>
        <span>23 Days ago</span> {/* Displaying the time ago when the review was posted */}
        {/* Share Button */}
        <button className="text-blue-500 hover:underline">Share</button> {/* Button to share the review */}
      </div>
    </div>
  );
};

export default ReviewCard; // Export the ReviewCard component for use elsewhere
