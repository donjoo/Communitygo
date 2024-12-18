import React, { useState } from "react";
import api from "../../api";
import { useNavigate, useParams } from "react-router-dom";

const OtpCard = () => {
  const { deliveryId, method } = useParams(); // Extract parameters
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [message, setMessage] = useState(""); 
  const navigate = useNavigate();

  const handleChange = (value, index) => {
    if (value.length > 1) return; // Ensure single digit
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to the next input if not the last one
    if (value && index < otp.length - 1) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };


  const Pickedup = async () => {
      const response = await api.post(`${deliveryId}/picked_up/`);
      if (response.status === 200){
        navigate(`/dropofflocation/${deliveryId}`)
      }
    };


    const CourierCompleted = async () => {
      try{
          const response = await api.post(`${deliveryId}/couriercompleted/`);
              if (response.status === 200){
                  navigate(`/couriercompleted/${deliveryId}`)
              }
      }catch (error){
          console.log("error completing courier",'error')
      }
  }



  const handleSubmit = async () => {
    const enteredOtp = otp.join("");
    console.log("Submitted OTP:", enteredOtp);

    try {
      const response = await api.post(`${deliveryId}/verify-otp/`, { otp: enteredOtp,method:method });
      if (response.status === 200 ) {
        setMessage("OTP verified successfully!");
        if (method === 'pickup'){
        Pickedup()
        }else{
          CourierCompleted()
        }
      } else {
        setMessage("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setMessage("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
          Enter OTP
        </h2>
        <div className="flex justify-center space-x-2 mb-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-12 h-12 text-center text-lg font-medium border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}
        </div>
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Submit
        </button>
        {message && (
          <p
            className={`mt-4 text-center ${
              message.includes("successfully") ? "text-green-500" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default OtpCard;
