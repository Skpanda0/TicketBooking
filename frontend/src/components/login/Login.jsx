import React, { useState, useRef, useEffect } from 'react'; // Import necessary hooks from React
import axios from 'axios'; // Import axios for HTTP requests
import { useNavigate } from 'react-router-dom'; // Import useNavigate for page navigation
import { useDispatch } from 'react-redux'; // Import useDispatch to dispatch actions to Redux store
import { login } from '../../redux/authSlice'; // Import login action from redux
import toast from "react-hot-toast"; // Import toast for notifications
import SpotlightCard from '../ui/SpotlightCard'; // Custom component for displaying a spotlight card
import StarBorder from '../ui/StarBorder'; // Custom button component styled as a star
import bg from "../../assets/bg.jpg"; // Import background image for the page

const LoginPage = () => {
  // Dispatch to trigger login action in Redux
  const dispatch = useDispatch();
  // Navigate hook to navigate between pages
  const navigate = useNavigate();

  // State hooks for form inputs and status
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Refs for form input validation and focus management
  const emailRef = useRef(null); // Ref for email input field
  const phoneRef = useRef(null); // Ref for phone input field

  // Validate if either email or phone is filled and correct format
  const validateInput = () => {
    const email = emailRef.current.value;
    const phone = phoneRef.current.value;

    if (!email && !phone) {
      toast.error('Please enter either an email or a phone number.');
      return false;
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address.');
      return false;
    }
    if (phone && (!/^\d{10}$/.test(phone) || phone.length !== 10)) {
      toast.error('Phone number must be exactly 10 digits.');
      return false;
    }
    return true;
  };

  // Validate OTP format to be exactly 4 digits
  const otpRef = useRef(null); // Ref for OTP input field
  const validateOtp = () => {
    if (!/^\d{4}$/.test(otp)) {
      toast.error('OTP must be exactly 4 digits.');
      return false;
    }
    return true
  }

  // Handle form submission to send OTP
  const onSubmit = async () => {
    if (!validateInput()) return; // Check if input is valid

    setLoading(true); // Set loading state to true
    const loadingToastId = toast.loading('Loading...'); // Show loading toast

    try {
        // Prepare request data, send only the non-empty field (email or phone)
        const requestData = {
            email: email.trim() || undefined,
            phone: phone.trim() || undefined,
        };

        if (!requestData.email && !requestData.phone) {
            toast.error('Please enter either an email or a phone number');
            return;
        }

        const response = await axios.post(`${process.env.PUBLIC_BASE_URL}/api/auth/send-otp`, requestData);

        if (response.status === 200) {
            toast.success('OTP sent successfully!', { id: loadingToastId }); // Show success message
            setOtpSent(true); // Set OTP sent flag to true
        }
    } catch (err) {
        // Handle any errors and display them using toast
        const errorMessage = err?.response?.data?.error || 'Error Sending OTP';
        toast.error(errorMessage, { id: loadingToastId });
    } finally {
        setLoading(false); // Set loading state to false once done
    }
};

  // Handle OTP verification
  const handleVerify = async () => {
    if (!validateOtp()) return; // Check if OTP is valid

    const loadingToastId = toast.loading('Loading...'); // Show loading toast

    try {
        // Prepare data for OTP verification
        const requestData = {
            email: email.trim() || undefined,
            phone: phone.trim() || undefined,
            otp: otp.trim(),
        };

        if (!requestData.email && !requestData.phone) {
            toast.error('Please enter either an email or phone number');
            return;
        }

        // Send OTP verification request
        const response = await axios.post(`${process.env.PUBLIC_BASE_URL}/api/auth/verify-otp`, requestData);

        if (response.status === 200) {
            const user = response.data;
            toast.success('OTP verified Successfully!', { id: loadingToastId }); // Show success message
            dispatch(login({ email, phone, userId: user.userDetails.userId })); // Dispatch login action with user data
            navigate(`/home/${user.userDetails.userId}`); // Navigate to home page after successful login
        }
    } catch (err) {
        // Handle errors and display appropriate message
        const errorMessage = err?.response?.data?.error || 'Error verifying OTP';
        toast.error(errorMessage, { id: loadingToastId });
    }
};

  // Listen for Enter key press to submit the form (either for OTP or phone/email submission)
  useEffect(() => {
    const handleEnter = (e) => {
      if (e.key === 'Enter') {
        otpSent ? handleVerify() : onSubmit(); // Call appropriate function based on OTP state
      }
    };

    document.addEventListener('keydown', handleEnter); // Attach event listener for keydown
    return () => document.removeEventListener('keydown', handleEnter); // Cleanup the listener on component unmount
  }, [otpSent, email, phone, otp]); // Dependencies for re-run if any of these change

  return (
    <div
      className="relative w-[100vw] h-[100vh] flex justify-center items-center bg-cover bg-center"
      style={{
        backgroundImage: `url(${bg})`, // Set background image dynamically
      }}
    >
      {/* Blackish Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      
      {/* Spotlight card component */}
      <SpotlightCard className="custom-spotlight-card p-4 border-2 border-gray-600 bg-black bg-opacity-60 rounded-xl flex flex-col justify-center items-center gap-8 hover:scale-110 transition-transform duration-300 ease-in-out" spotlightColor="rgba(228, 142, 112, 0.4)">
        <div className='flex flex-col justify-center items-center gap-5'>
          {otpSent ? (
            <div className='flex flex-col items-center gap-4'>
              <h2 className='text-left w-full text-gray-200 m-2'>OTP Verify</h2>
              <input
                ref={otpRef}
                className='text-gray-200 bg-transparent focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-none border border-gray-300 rounded-xl p-2 w-full'
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)} // Update OTP value on change
                minLength={4}
                maxLength={4}
                placeholder="Enter 4-digit OTP"
              />
              {/* Custom button component to verify OTP */}
              <StarBorder
                as="button"
                className="custom-class"
                color="black"
                speed="5s"
                onClick={handleVerify}
              >
                Verify
              </StarBorder>
            </div>
          ) : (
            <div className=''>
              {/* Form for email and phone number input */}
              <div className='flex flex-col items-center gap-4'>
                <div className='m-2'>
                  <h2 className='text-gray-200 m-2'>Email</h2>
                  <input
                    ref={emailRef}
                    type="email"
                    placeholder="Enter your email"
                    className='text-gray-200 bg-transparent focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-none border border-gray-300 rounded-xl p-2 w-full'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} // Update email value on change
                  />
                </div>

                <h2 className='text-gray-200'>Or</h2>

                <div className='flex flex-col'>
                  <h2 className='text-gray-200 m-2'>Phone Number</h2>
                  <input
                    ref={phoneRef}
                    type="tel"
                    placeholder="Enter phone number"
                    className='text-gray-200 bg-transparent focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-none border border-gray-300 rounded-xl p-2 w-full'
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)} // Update phone number on change
                  />
                </div>
                {/* Submit button to send OTP */}
                <StarBorder
                  as="button"
                  className="custom-class"
                  color="white"
                  speed="3s"
                  onClick={onSubmit}
                >
                  Submit
                </StarBorder>
              </div>
            </div>
          )}
        </div>
      </SpotlightCard>
    </div>
  );
};

export default LoginPage; // Export LoginPage component for use in other parts of the app
