import React, { useState, useRef } from 'react';
import { useNavigate,useLocation } from 'react-router-dom';
import api from '../../api'

function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const emailFromRegistration = location?.state?.email || '';
  const [otp, setOtp] = useState({ input1: '', input2: '', input3: '', input4: '' });

  // Create an array of refs for each input field
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;

    // Check if the backspace key is pressed and move to the previous input field
    if (e.nativeEvent.inputType === 'deleteContentBackward') {
      if (index > 0) {
        inputRefs[index - 1].current.focus();
      }
    }

    // Update the state
    setOtp((prevOtp) => ({
      ...prevOtp,
      [name]: value,
    }));

    // Move to the next input field if the value is not empty and not the last input field
    if (value !== '' && index < 3) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleVerification = async (event) => {
        event.preventDefault();
     console.log(Object.values(otp).join(''));
     console.log(emailFromRegistration);

    try {
      const response = await api.post('verifyotp/', {
        email: emailFromRegistration,
        otp: Object.values(otp).join(''), // Concatenate the OTP values
        // Add any other necessary data for verification
      });
  
      if (response.status === 200) {
        // If verification is successful, you can redirect or perform other actions

        console.log('User successfully verified');
        // toast.success('User successfully verified. Please login using email and password');
        navigate("/login")
      } else {
        // Handle other response statuses or show an error message
        // toast.error('OTP verification failed',response.error);
        console.error('OTP verification failed');
      }
    } catch (error) {
        // toast.error('Error during OTP verification', error); 
      console.error('Error during OTP verification', error);
    }
  };

  return (
    <>
     <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full"
        onSubmit={handleVerification}
      >
        <h1 className="text-2xl font-bold text-center text-gray-700">OTP Verification</h1>
        <p className="text-sm text-center text-gray-500 mt-2">
          We have sent a verification code to your email.
        </p>

        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: 4 }, (_, index) => (
            <input
              key={index}
              type="text"
              name={`input${index + 1}`}
              maxLength="1"
              value={otp[`input${index + 1}`] || ''}
              onChange={(e) => handleInputChange(e, index)}
              ref={inputRefs[index]}
              className="w-12 h-12 text-center border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          ))}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-medium py-2 px-4 mt-6 rounded-md hover:bg-blue-600 transition duration-200"
        >
          Verify Me
        </button>
      </form>
    </div>
    </>
  );
}

export default VerifyOtp;