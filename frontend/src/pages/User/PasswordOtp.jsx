import React, { useState } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";

function PasswordOtp() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("changepassword/send-otp/", { email });
      setMessage(response.data.detail);
      setEmail(""); // Clear input after sending OTP
      if (response.status === 200) {
        navigate("/change-password");
      }
    } catch (err) {
      setMessage(err.response.data.email || "An error occurred.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Send OTP</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Send OTP
          </button>
        </form>
        {message && (
          <p
            className={`mt-4 text-center text-sm font-medium ${
              message.toLowerCase().includes("error")
                ? "text-red-500"
                : "text-green-500"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default PasswordOtp;
