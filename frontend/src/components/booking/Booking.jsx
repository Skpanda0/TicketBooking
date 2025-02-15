import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { fetchHalls } from "../../redux/bookingSlice";
import { useDispatch } from "react-redux";
import { bookData } from "../../redux/seatSlice";
import Tippy from "@tippyjs/react";

const Booking = () => {
  const navigate = useNavigate();
  const { movieName, city } = useParams(); // Get movie name and city from URL params
  const info = useSelector((state) => state.movieData.movieInfo); // Fetch movie info from the redux store
  const dispatch = useDispatch();
  const { halls } = useSelector((state) => state.booking); // Fetch halls data from the redux store
  const [date, setDate] = useState(null); // State to manage selected date

  // Prepare the next 7 days (datesArray) for date selection
  const today = new Date();
  const currentHours = today.getHours(); // Get current hour
  const currentMinutes = today.getMinutes(); // Get current minute

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthName = [
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec",
  ];
  const datesArray = [];

  // Loop to generate the next 7 days
  for (let i = 0; i < 7; i++) {
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + i); // Increment days
    const day = String(futureDate.getDate()).padStart(2, "0");
    const dayName = daysOfWeek[futureDate.getDay()];
    const name = monthName[futureDate.getMonth()];
    datesArray.push({ date: day, month: name, day: dayName });
  }

  // Fetch halls data whenever movieName or city changes
  useEffect(() => {
    const loadingToastId = toast.loading("Loading...");
    dispatch(fetchHalls({ city, movieName }))
      .unwrap()
      .then(() => {
        // console.log("loading..")
        toast.dismiss(loadingToastId);
      })
      .catch(() => {
        toast.error("Failed to load halls.", { id: loadingToastId });
      });
  }, [movieName, dispatch]);

  // Handle booking click
  const handleBookingClick = (timing, hall) => {
    if (date === null) {
      toast.error("Please select a date");
      return;
    }
    if (!city) {
      toast.error("Please select a city");
      return;
    }
    dispatch(
      bookData({
        name: movieName,
        location: city,
        timing,
        hallName: hall,
        day: date.day,
        date: date.date,
        month: date.month,
      })
    );
    navigate(`/movie/${movieName}/${city}/booking/seat`); // Navigate to seat selection page
  };

  // Check if the time is in the past (disabled) for today's date
  const isTimeDisabled = (time, selectedDate) => {
    const [hours, minutes] = time
      .split(/[:\s]/)
      .map((t, i) => (i < 2 ? parseInt(t, 10) : t)); // Convert time to 24-hour format
    const isPM = time.includes("pm");
    const timeIn24 = isPM && hours < 12 ? hours + 12 : hours; // Convert to 24-hour if "pm"

    if (
      selectedDate?.date === String(today.getDate()).padStart(2, "0") &&
      selectedDate?.month === monthName[today.getMonth()]
    ) {
      // Compare with today's date and time
      if (
        timeIn24 < currentHours ||
        (timeIn24 === currentHours && minutes <= currentMinutes)
      ) {
        return true; // Disable past times
      }
    }
    return false; // Enable future times
  };

  return (
    <div className="flex flex-col flex-wrap min-h-[100vh]">
      {/* Movie Header */}
      <div className="border-y-2 border-gray-200 mt-4 px-4">
        <h1 className="text-[40px] font-semibold my-4 pl-4">
          {movieName} ({info?.Language || "Language Info"})
        </h1>
        <h1 className="text-[20px] font-normal my-4 pl-4">
          ({info?.Genre || "Genre Info"})
        </h1>
      </div>

      <div className="bg-gray-100 border-b-2 border-gray-200">
        {/* Buttons for Next 7 Days */}
        <div className="flex flex-wrap px-4 gap-2 border-2 py-4 border-gray-200 m-4 bg-white rounded-xl">
          {datesArray.map((item, index) => (
            <button
              onClick={() =>
                setDate({ date: item.date, month: item.month, day: item.day })
              }
              key={index}
              className={`flex flex-col justify-center items-center text-sm hover:bg-red-500 hover:text-white w-[40px] h-[60px] rounded-lg focus:bg-red-500 focus:text-white ${
                date?.date === item.date && date?.month === item.month
                  ? "bg-red-500 text-white"
                  : ""
              }`}
            >
              <span className="font-thin text-[14px]">{item.day}</span>
              <span className="font-semibold ">{item.date}</span>
              <span className="font-thin text-[14px]">{item.month}</span>
            </button>
          ))}
        </div>

        <div className="flex flex-col flex-wrap px-4 gap-4 border-2 py-4 border-gray-200 m-4 bg-white rounded-xl">
          {/* Display halls and show available timings */}
          {halls.map((hall, index) => (
            <div key={index} className="flex flex-wrap">
              <span className="font-[400] w-1/3">{hall.name}</span>
              <div className="flex gap-4">
                {/* Available showtimes */}
                {["02:45 pm", "06:00 pm", "09:15 pm"].map((time, i) => (
                  <Tippy
                    key={i}
                    placement="top"
                    delay={[200, 0]}
                    arrow={false}
                    content={
                      <div className="flex flex-col justify-center items-center object-fill bg-white text-black border border-gray-200 p-2 rounded-lg shadow-xl">
                        <span className="font-semibold text-[16px]">
                          Rs: 150.00
                        </span>
                        <span className="font-thin text-[10px]">Balcony</span>
                        <span className="font-thin text-[12px] text-green-400">
                          Available
                        </span>
                      </div>
                    }
                  >
                    <button
                      className={`border border-gray-400 p-3 text-green-400 ${
                        isTimeDisabled(time, date)
                          ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                          : ""
                      }`}
                      onClick={() => handleBookingClick(time, hall)}
                      disabled={isTimeDisabled(time, date)} // Disable past times
                    >
                      {time}
                    </button>
                  </Tippy>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Booking;
