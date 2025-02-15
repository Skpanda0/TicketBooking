import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ChevronLeft, X, Pen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { updateReservedSeats } from "../../redux/seatSlice";
import axios from "axios";
import io from "socket.io-client"; // Import WebSocket client

const socket = io("http://localhost:6969"); // Connect to backend WebSocket

const Seat = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    movieName,
    location,
    timing,
    hallName,
    day,
    date,
    month,
    reservedSeats,
  } = useSelector((state) => state.seat); // Select state properties from Redux
  const userId = useSelector((state) => state.auth.userId); // Get userId from auth state
  const [seats, setSeats] = useState(2); // State for the number of seats selected
  const [showPopup, setShowPopup] = useState(false); // State for toggling the seat selection popup
  const [selectedSeats, setSelectedSeats] = useState([]); // State to keep track of selected seats
  const [amount, setAmounts] = useState(0); // State for calculating total price
  const [loading, setLoading] = useState(false); // Loading state to manage spinner
  const [errorMessage, setErrorMessage] = useState(""); // State for error messages

  // Check if movie details exist, else display a loading message
  if (!movieName || !hallName) {
    return <div>Loading...</div>; // Show loading message if movieName or hallName is missing
  }

  // Fetch reserved seats when component mounts or when movie-related data changes
  useEffect(() => {
    const loadingToastId = toast.loading("Loading...");
    const fetchReservedSeats = async () => {
      try {
        const response = await axios.post(
          "http://localhost:6969/api/get-reserved-seats",
          {
            movieName,
            location,
            timing,
            hallName,
            day,
            date,
            month,
          }
        );
        if (response.status === 200) {
          dispatch(updateReservedSeats(response.data.reservedSeats));
          toast.dismiss(loadingToastId); // Dismiss loading toast when data is fetched
          // console.log(reservedSeats); // Commented out console.log to debug reservedSeats
        }
      } catch (error) {
        console.error("Error fetching reserved seats:", error);
        setErrorMessage("Failed to fetch reserved seats."); // Display error if fetching fails
        toast.error("error in fetching", { id: loadingToastId }) // Dismiss loading toast when error occurs
      } finally {
        setLoading(false); // Stop loading after the request is complete
      }
    };

    fetchReservedSeats(); // Call fetch function to get reserved seats
  }, [dispatch, movieName, location, timing, hallName, day, date, month]);
   
   //  WebSocket for Real-Time Seat Updates**
   useEffect(() => {
    socket.on("seatUpdate", (data) => {
      dispatch(updateReservedSeats(data.reservedSeats));
    });

    return () => {
      socket.off("seatUpdate"); // Clean up listener on unmount
    };
  }, [dispatch]);

  

  // Update amount when selectedSeats changes
  useEffect(() => {
    setAmounts(150 * selectedSeats.length); // Calculate total price (Rs: 150 per seat)
  }, [selectedSeats]);

  // Toggle ticket selection popup visibility
  const handleTicket = () => setShowPopup(!showPopup);

  // Toggle seat selection popup visibility
  const handleSelectSeats = () => setShowPopup(!showPopup);

  // Handle seat click to select or deselect seats
  const handleSeatClick = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      // Deselect the seat if already selected
      setSelectedSeats(selectedSeats.filter((seat) => seat !== seatNumber));
    } else if (selectedSeats.length < seats) {
      // Select a seat if the number of selected seats is less than the limit
      setSelectedSeats([...selectedSeats, seatNumber]);
    } else {
      // Replace a seat when the limit is exceeded
      setSelectedSeats([...selectedSeats.slice(1), seatNumber]);
    }
  };

  // Load the Razorpay script dynamically for payment processing
  const loadRazorpayScript = () => {
    return new Promise((resolve, reject) => {
      if (window.Razorpay) {
        resolve(window.Razorpay); // If Razorpay script is already loaded, resolve
      } else {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(window.Razorpay); // Resolve when the script is loaded
        script.onerror = () => reject(new Error("Razorpay SDK failed to load.")); // Reject if there is an error loading the script
        document.head.appendChild(script); // Append the script to the document
      }
    });
  };

  // Handle the payment process with Razorpay
  const handlePayment = async () => {
    if (selectedSeats.length === 0) {
      toast.error("Please select seats"); // Show error if no seats are selected
      return;
    }
    try {
      setLoading(true); // Start loading spinner

      // Correctly structure hallName as an object (ensure hallName is passed as an object in backend)
      const hallDetails = {
        name: hallName.name, // Extract hall name
        seats: hallName.seats, // Extract number of seats in the hall
      };

      // Send a request to backend to create Razorpay order for seat reservation
      const response = await axios.post("http://localhost:6969/api/reserve-seats", {
        movieName,
        location,
        timing,
        hallName: hallDetails, // Pass hallName as an object
        day,
        date,
        month,
        selectedSeats: selectedSeats,
        id: userId,
      });

      const { orderId, amount, currency } = response.data; // Extract payment details from response

      // Load Razorpay script and initiate payment
      const Razorpay = await loadRazorpayScript();

      if (!Razorpay) {
        setLoading(false); // Stop loading if Razorpay script fails to load
        toast.error("Razorpay SDK failed to load. Please try again.");
        return;
      }

      const options = {
        key: "rzp_test_eWD6xZRsShtFEb", // Replace with your Razorpay API key
        amount: amount,
        currency: currency,
        order_id: orderId,
        handler: async function (paymentResult) {
          try {
            // Send payment details to backend for verification
            const paymentDetails = {
              razorpay_order_id: paymentResult.razorpay_order_id,
              razorpay_payment_id: paymentResult.razorpay_payment_id,
              razorpay_signature: paymentResult.razorpay_signature,
            };
            // console.log("User ID being sent:", userId); // Commented out console.log
            const now = new Date();

            const options = {
              weekday: 'short', // Mon
              day: '2-digit',   // 10
              month: 'short',   // Jan
              hour: '2-digit',  // 9
              minute: '2-digit', // 25
              hour12: true,     // 12-hour format
              timeZone: 'Asia/Kolkata' // Indian Standard Time
            };
        
            const formatter = new Intl.DateTimeFormat('en-US', options);
            const verifyResponse = await axios.post(
              "http://localhost:6969/api/verify-payment",
              {
                paymentResult: paymentDetails,
                selectedSeats: selectedSeats,
                id: userId,
                movieName,
                location,
                timing,
                hallName: hallDetails,
                day,
                date,
                month,
                bookingtime : formatter.format(now)
              },
              { headers: { "Content-Type": "application/json" } }
            );

            // Handle success of payment verification
            // console.log("Payment Verified:", verifyResponse.data); // Commented out console.log
            if (verifyResponse.status === 200) {
              dispatch(updateReservedSeats(verifyResponse.data.reservedSeats)); // Update reserved seats in Redux
              setAmounts(0); // Reset amount to 0 after successful booking
              toast.success("Successfully booked"); // Show success message
            }
          } catch (error) {
            console.error("Error verifying payment:", error);
            setErrorMessage("Payment verification failed. Please try again.");
          }
        },
        prefill: {
          name: "User Name", // Replace with user's name
          email: "user@example.com", // Replace with user's email
          contact: "9999999999", // Replace with user's contact number
        },
        theme: {
          color: "#F37254", // Razorpay theme color
        },
      };

      // Open Razorpay payment modal
      const razorpay = new Razorpay(options);
      razorpay.open();

      setLoading(false); // End loading after payment modal opens
    } catch (error) {
      console.error("Error initiating payment:", error);
      setLoading(false); // End loading if payment initiation fails
      setErrorMessage("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="min-h-[100vh]">
      {/* Header */}
      <div className="relative border-b-2 border-gray-200 p-4 flex flex-wrap place-content-between">
        <div className="flex gap-2">
          <button className="opacity-[0.50]" onClick={() => navigate(-1)}>
            <ChevronLeft size={40} />
          </button>
          <div>
            <h1 className="font-semibold text-lg">{movieName}</h1>
            <p className="font-light text-sm">
              {hallName.name} | {day}, {date} {month}, {timing}
            </p>
          </div>
        </div>
        <div className="flex gap-3 p-2">
          <button
            className="flex justify-center px-2 items-center gap-3 border border-gray-400 rounded-lg"
            onClick={handleTicket}
          >
            <span>{seats} Tickets</span>
            <Pen size={12} />
          </button>
          <button className="opacity-[0.50]" onClick={() => navigate(-1)}>
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Seat Selection */}
      <div className="bg-gray-200">
        <div className="mx-4 bg-white p-4 flex flex-col">
          <span className="font-light text-sm border-b-2 w-full p-4">
            Rs: 150.00, Balcony
          </span>
          <div className="grid grid-cols-10 gap-2 border-b-2 pb-4 pt-4">
            {Array.from({ length: hallName.seats }, (_, i) => i + 1).map(
              (number) => {
                const isReserved = !!reservedSeats.find(
                  (seat) => seat.seatNumber == number
                );
                return (
                  <div key={number} className="flex justify-center items-center">
                    <button
                      onClick={() => !isReserved && handleSeatClick(number)}
                      className={`border-2 w-[28px] rounded-lg ${
                        isReserved
                          ? "bg-gray-400 cursor-not-allowed"
                          : selectedSeats.includes(number)
                          ? "bg-green-400 border-green-500"
                          : "hover:bg-green-200 hover:border-green-400"
                      }`}
                      disabled={isReserved}
                    >
                      {number}
                    </button>
                  </div>
                );
              }
            )}
          </div>
        </div>
        <div className="bg-white flex justify-center items-center w-full my-4 p-4">
          <button
            onClick={handlePayment}
            className="button-0 px-7 py-3 rounded-xl bg-red-500 text-white hover:bg-red-600"
          >
            {loading ? "Processing..." : `Pay ${amount}.00`}
          </button>
        </div>
      </div>

      {/* Popup for Selecting Number of Seats */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 backdrop-filter backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96 flex flex-col justify-center items-center">
            <h1>How many seats?</h1>
            <div className="flex gap-3">
              {["1", "2", "3", "4", "5"].map((num, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSeats(Number(num));
                    setSelectedSeats([]); // Clear selected seats when number of seats changes
                  }}
                  className={`px-3 py-1 rounded-full my-3 ${
                    seats === Number(num)
                      ? "bg-red-500 text-white"
                      : "hover:bg-red-400 hover:text-white"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
            <div className="flex flex-col justify-center my-2 items-center object-fill bg-white text-black border border-gray-200 p-2 rounded-lg shadow-xl">
              <span className="font-semibold text-[12px]">Rs: 150.00</span>
              <span className="font-thin text-[10px]">Balcony</span>
              <span className="font-thin text-[12px] text-green-400">
                Available
              </span>
            </div>
            <button
              onClick={handleSelectSeats}
              className="bg-red-500 px-2 py-1 rounded-lg hover:bg-red-600 hover:shadow-lg"
            >
              Select Seats
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Seat;
