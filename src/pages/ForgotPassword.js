import React, { useState } from "react";
import { Link } from "react-router-dom";
import { myImg } from "../assets/Images";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "../commonComponent/Button";
import apiClient from "../api/apiClient";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async () => {
    if (!email) {
      toast.error("Email is required");
    } else if (!validateEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    try {
      setLoading(true);
      const res = await apiClient.post(`/api/doctors/forgot-password`, {
        email,
      });

      if (res.status === 200) {
        toast.success("Reset Link sent to your Registered Email Address");
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100">
      {/* Card Container */}
      <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-10 w-[90%] sm:w-[400px] flex flex-col items-center space-y-8">
        {/* Heading */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold text-[#043133]">Forgot Password</h1>
          <p className="text-gray-600 font-medium text-sm sm:text-base">
            Enter your registered email address
          </p>
        </div>

        {/* Input */}
        <div className="w-full space-y-2">
          <label className="text-[#043133] font-semibold">Email</label>
          <input
            type="email"
            placeholder="Enter your registered email address"
            className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-[#7537ac] 
                   focus:outline-none focus:ring-1 focus:ring-[#521785] transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Button */}
        <Button
          className={`w-full py-3 text-white font-semibold rounded-lg shadow-md transition 
      ${
        loading
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-[#521785] hover:bg-[#3b1066]"
      }`}
          onClick={handleSubmit}
          disabled={loading}
        >
          SEND RESET LINK
        </Button>

        {/* Back to Login */}
        <Link to="/" className="text-[#DE9609] font-semibold hover:underline">
          Back to Login
        </Link>

        {/* Note */}
        <p className="text-sm text-center text-[#4D5959] leading-relaxed">
          If you cannot find the confirmation email in your inbox, please check
          your <span className="font-semibold">spam</span> or{" "}
          <span className="font-semibold">junk</span> folder.
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
