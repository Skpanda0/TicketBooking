import React, { useState } from "react";  // Importing React and useState for managing state in the component
import { FaRegQuestionCircle } from "react-icons/fa";  // Importing an icon for the question mark
import { FaTwitter, FaFacebook, FaGithub } from "react-icons/fa";  // Importing icons for social media links
import toast from "react-hot-toast";  // Importing toast for showing notifications

const HelpSupport = () => {
  // State variables to control the visibility of popups for feedback, FAQ, and contact
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isFAQOpen, setIsFAQOpen] = useState(false);
  const [isContactPopupOpen, setIsContactPopupOpen] = useState(false);

  // Toggle functions to open/close feedback, FAQ, and contact popups
  const toggleFeedbackPopup = () => {
    setIsFeedbackOpen(!isFeedbackOpen);  // Toggle the state for feedback popup visibility
  };

  const toggleFAQPopup = () => {
    setIsFAQOpen(!isFAQOpen);  // Toggle the state for FAQ popup visibility
  };

  const toggleContactPopup = () => {
    setIsContactPopupOpen(!isContactPopupOpen);  // Toggle the state for contact popup visibility
  };

  // Handle form submission and reset the form
  const handleFormSubmit = (e) => {
    e.preventDefault();  // Prevent the default form submission
    e.target.reset();  // Reset the form fields
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-wrap flex-col items-center justify-center py-8 px-4">
      {/* Main title section */}
      <div className="text-center mb-8">
        <FaRegQuestionCircle className="text-red-500 text-6xl mx-auto mb-4" /> {/* Displaying the question icon */}
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Help & Support</h1>
        <p className="text-gray-600 max-w-md mx-auto">
          Welcome to the help and support page of our movie ticket booking website.
          Find answers to your questions and get in touch with us for assistance.
        </p>
      </div>

      {/* Grid for displaying sections: FAQs, Contact Us, and Feedback */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        {/* FAQ Section */}
        <div className="bg-white shadow-lg rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">FAQs</h2>
          <p className="text-gray-600 mb-4">
            Explore frequently asked questions about booking, payments, and more.
          </p>
          <button
            onClick={toggleFAQPopup}  // Toggles the FAQ popup
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            View FAQs
          </button>
        </div>

        {/* Contact Us Section */}
        <div className="bg-white shadow-lg rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Contact Us</h2>
          <p className="text-gray-600 mb-4">
            Need more help? Get in touch with our support team for assistance.
          </p>
          <button
            onClick={toggleContactPopup}  // Toggles the contact popup
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Contact Support
          </button>
        </div>

        {/* Feedback Section */}
        <div className="bg-white shadow-lg rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Feedback</h2>
          <p className="text-gray-600 mb-4">
            Share your experience and help us improve our service.
          </p>
          <button
            onClick={toggleFeedbackPopup}  // Toggles the feedback popup
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Give Feedback
          </button>
        </div>
      </div>

      {/* Feedback Popup */}
      {isFeedbackOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Feedback Form</h2>
            <textarea
              className="w-full border border-gray-300 rounded-lg p-2 mb-4"
              rows="4"
              placeholder="Write your feedback here..."
            ></textarea>
            <div className="flex justify-end gap-2">
              <button
                onClick={toggleFeedbackPopup}  // Closes the feedback popup
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  toast.success("Thank you for your feedback")  // Show success toast
                  setIsFeedbackOpen(!isFeedbackOpen);  // Close the feedback popup
                }}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FAQ Popup */}
      {isFAQOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-bold text-gray-800 mb-4">FAQs</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>How do I book a ticket?</li>
              <li>What payment methods are accepted?</li>
              <li>Can I cancel or modify my booking?</li>
              <li>How do I get a refund?</li>
            </ul>
            <div className="flex justify-end mt-4">
              <button
                onClick={toggleFAQPopup}  // Closes the FAQ popup
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Popup */}
      {isContactPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Contact Us</h2>
            <p className="text-gray-600 mb-4">Connect with the developers through the following platforms:</p>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-600 hover:text-black">
                <FaTwitter/>
                <a
                  href="https://x.com/SkPanda350569"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  X 
                </a>
              </li>
              <li className="flex items-center gap-2 text-gray-600 hover:text-blue-500">
                <FaFacebook  />
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Facebook
                </a>
              </li>
              <li className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                <FaGithub  />
                <a
                  href="https://github.com/Skpanda0"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              </li>
            </ul>
            <div className="flex justify-end mt-4">
              <button
                onClick={toggleContactPopup}  // Closes the contact popup
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report an Issue Section */}
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-lg p-6 mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Report an Issue</h2>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-600 mb-1" htmlFor="issue">Describe the Issue</label>
            <textarea
              id="issue"
              className="w-full border border-gray-300 rounded-lg p-2"
              rows="4"
              placeholder="Describe your issue here..."
            ></textarea>
          </div>
          <div>
            <label className="block text-gray-600 mb-1" htmlFor="email">Your Email</label>
            <input
              id="email"
              type="email"
              className="w-full border border-gray-300 rounded-lg p-2"
              placeholder="Enter your email address"
            />
          </div>
          <button 
            onClick={() => {
              toast.success("Issue submitted")  // Show success toast for issue submission
            }} 
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Submit Issue
          </button>
        </form>
      </div>
    </div>
  );
};

export default HelpSupport;
