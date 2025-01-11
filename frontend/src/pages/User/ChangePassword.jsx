import React, { useState } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";

function ChangePassword() {
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await api.post("change-password/", { otp, new_password: newPassword });
      setMessage(response.data.detail);
      // Optionally redirect or clear fields after successful change
      setOtp("");
      setNewPassword("");
      if (response.status){
        navigate('/profile')
      }
    } catch (err) {
      setMessage(err.response.data.otp || err.response.data.new_password || "An error occurred.");
    }
  };

  return (
    <div>
      <h1>Change Password</h1>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          value={otp} 
          onChange={(e) => setOtp(e.target.value)} 
          placeholder="Enter your OTP" 
          required 
        />
        <input 
          type="password" 
          value={newPassword} 
          onChange={(e) => setNewPassword(e.target.value)} 
          placeholder="Enter new password" 
          required 
        />
        <button type="submit">Change Password</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default ChangePassword;
