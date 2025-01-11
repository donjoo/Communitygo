import React, { useState } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";

function PasswordOtp() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await api.post("changepassword/send-otp/", { email });
      setMessage(response.data.detail);
      setEmail(""); // Clear input after sending OTP
      if (response.status === 200) {
      navigate('/change-password')
      }
    } catch (err) {
      setMessage(err.response.data.email || "An error occurred.");
    }
  };

  return (
    <div>
      <h1>Send OTP</h1>
      <form onSubmit={handleSubmit}>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="Enter your email" 
          required 
        />
        <button type="submit">Send OTP</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default PasswordOtp;
