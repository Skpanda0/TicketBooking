import React from "react";
import logo from "../../assets/logo.jpg"
import { AiFillTwitterCircle } from "react-icons/ai";
import { FaGithub, FaInstagram, FaFacebook } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const Footer = () => {
  const userId = localStorage.getItem('userId'); // Retrieve user ID from localStorage
  const navigate = useNavigate(); // Navigate to different routes

  return (
    <footer className="bg-gray-800 text-gray-300 py-8">
      <div className="container mx-auto px-4">
        {/* Top Section */}
        <div className="flex flex-wrap justify-between items-center border-b border-gray-700 pb-6">
          <div className="mb-4 md:mb-0">
            <p className="text-lg font-semibold">List your Show</p>
            <p className="text-sm">
              Got a movie show? Partner with us & get listed on 
              <Link
                onClick={() => {
                  userId
                    ? navigate(`/home/${userId}`) // If user is logged in, navigate to their home
                    : navigate("/"); // Otherwise, navigate to the home page
                }}
                className="text-red-500">
                MovieBooking
              </Link>
            </p>
          </div>
          {/* Button to navigate to the help page */}
          <button
            onClick={() => navigate(`/${userId}/help`)} // Navigate to the help page
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-pink-600">
            Contact today!
          </button>
        </div>

        {/* Middle Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-6 text-sm">
          {/* Movies Now Showing */}
          <div>
            <h3 className="text-white font-semibold mb-2">
              MOVIES NOW SHOWING IN INDIA
            </h3>
            <p>
              Pushpa: The Rule - Part 2 | RRR | The Batman | Vanvaas | Jailer | Mufasa: The Lion King | Marco | Solo Leveling: ReAwakening | Demon Slayer: Kimetsu no Yaiba - The Movie: Mugen Train | Jujutsu Kaisen 0 | Daman
            </p>
          </div>

          {/* Upcoming Movies in Berhampur */}
          <div>
            <h3 className="text-white font-semibold mb-2">
              UPCOMING MOVIES IN BERHAMPUR (ODISHA)
            </h3>
            <p>
              Mallik Ni Varta | Wolf Man | Jigar Ni Jeet | Daaku Maharaja (Tamil) | Kanna Muche Kaade Goode | Off Road | Jhumur
            </p>
          </div>

          {/* Movies by Genre */}
          <div>
            <h3 className="text-white font-semibold mb-2">MOVIES BY GENRE</h3>
            <p>
              Drama Movies | Action Movies | Thriller Movies | Anime Movies | Adventure Movies
            </p>
          </div>
        </div>

        {/* Additional Links Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 py-6 text-sm border-t border-gray-700">
          {/* Plays in Top Cities */}
          <div>
            <h3 className="text-white font-semibold mb-2">PLAYS IN TOP CITIES</h3>
            <p>Plays in Mumbai | Plays in Delhi-NCR | Plays in Chennai | Plays in Bengaluru</p>
          </div>
          {/* Activities in Top Cities */}
          <div>
            <h3 className="text-white font-semibold mb-2">ACTIVITIES IN TOP CITIES</h3>
            <p>Activities in Mumbai | Activities in Delhi-NCR | Activities in Chennai</p>
          </div>
          {/* Movies Now Showing */}
          <div>
            <h3 className="text-white font-semibold mb-2">MOVIES NOW SHOWING</h3>
            <p>Game Changer | Emergency | Azaad | Pushpa 2: The Rule | Fateh</p>
          </div>
          {/* Countries */}
          <div>
            <h3 className="text-white font-semibold mb-2">COUNTRIES</h3>
            <p>Indonesia | Singapore | UAE | Sri Lanka | West Indies</p>
          </div>
          {/* Help Section */}
          <div>
            <h3 className="text-white font-semibold mb-2">HELP</h3>
            <p>About Us | Contact Us | FAQs | Sitemap | Terms & Conditions</p>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-700 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            {/* Copyright Notice */}
            <p className="text-sm">
              The content and images used on this site are copyright protected
              and copyrights vest with the respective owners. Unauthorized use
              is prohibited.
            </p>
          </div>

          {/* Social Media Icons */}
          <div className="flex justify-center space-x-4 mt-4">
            <a href="https://www.facebook.com/" className="text-gray-400 hover:text-white">
              <FaFacebook size={25} /> {/* Facebook Icon */}
            </a>
            <a href="https://x.com/SkPanda350569" className="text-gray-400 hover:text-white">
              <AiFillTwitterCircle size={25}/> {/* Twitter Icon */}
            </a>
            <a href="https://www.instagram.com/" className="text-gray-400 hover:text-white">
              <FaInstagram size={25} /> {/* Instagram Icon */}
            </a>
            <a href="https://github.com/Skpanda0" className="text-gray-400 hover:text-white">
              <FaGithub size={25} /> {/* GitHub Icon */}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
