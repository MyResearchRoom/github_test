import React, { useState } from "react";
import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@mui/material";
import apiClient from "../../../api/apiClient";

const Password = () => {
  // States to manage password visibility
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // States for form values
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Toggle password visibility
  const toggleOldPasswordVisibility = () => {
    setShowOldPassword(!showOldPassword);
  };
  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
    setShowConfirmPassword(false)
  };
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
    setShowNewPassword(false)
  };

  //validation for password
  const validatePasswords = () => {
    if (!oldPassword) {
      toast.error("Old Password cannot be empty");
      return false;
    }
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long");
      return false;
    }
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/
    if (!passwordRegex.test(newPassword)) {
      toast.error(
       "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character."
      );
      return false;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New Password does not match Confirm Password");
      return false;
    }
    return true;
  };

  // Handle Change Password
  const handleChangePassword = async () => {

    if (!validatePasswords()) {
      return;
    }

    try {

      const response = await apiClient.post(
        "/api/doctors/change-password",
        {
          oldPassword,
          newPassword,
        }
      );
      // console.log("res",response);

      if (response.status === 200) {
        toast.success("Password changed successfully");
        setNewPassword("");
        setOldPassword("");
        setConfirmPassword("");
      } else{
        toast.error('Failed to change password')
      }
    } catch (error) {
      // console.log("API Error:", error);
      // console.log("Status:", error.response?.status);
      toast.error(
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to change password."
      );
    }
  };

  return (
    <div className="flex flex-col justify-center items-center text-[#343C6A] w-full p-1 min-h-[100%] h-auto bg-white rounded-lg shadow-md">
     <div className="lg:w-[50%] sm:w-[60%] w-[90%] min-h-[60%] h-auto border rounded-lg shadow-lg flex flex-col justify-center items-center p-4">
       <h1 className="text-xl text-center  font-semibold">Change Password</h1>
      {/* Old Password */}
      <div
        className="grid grid-cols-1 gap-2 mt-10 w-[90%] mb-4"
        style={{ gridTemplateColumns: "1fr" }}
      >
        <label className="font-semibold">Old Password:</label>
        <div className="relative w-full">
          <input
            type={showOldPassword ? "text" : "password"}
            placeholder="Enter Old Password"
            className="p-2 outline-none w-[100%] bg-gray-100 border border-gray-300 rounded-lg"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          {/* Eye Icon */}
          <span
            className="absolute top-3 right-3 cursor-pointer"
            onClick={toggleOldPasswordVisibility}
          >
            {showOldPassword ? (
              <IoEyeOffOutline size={18} />
            ) : (
              <IoEyeOutline size={18} />
            )}
          </span>
          
        </div>

        {/* New Password */}
        <label className="font-semibold">New Password:</label>
        <div className="relative">
          <input
            type={showNewPassword ? "text" : "password"}
            placeholder="Enter New Password"
            className="p-2 w-[100%] outline-none bg-gray-100 border border-gray-300 rounded-lg"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          {/* Eye Icon */}
          <span
            className="absolute top-3 right-3 cursor-pointer"
            onClick={toggleNewPasswordVisibility}
          >
            {showNewPassword ? (
              <IoEyeOffOutline size={18} />
            ) : (
              <IoEyeOutline size={18} />
            )}
          </span>
        </div>

        {/* Confirm Password */}
        <label className="font-semibold">Confirm Password:</label>
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Re-enter Password"
            className="p-2 w-[100%] outline-none bg-gray-100 border border-gray-300 rounded-lg"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <span
            className="absolute top-3 right-3 cursor-pointer"
            onClick={toggleConfirmPasswordVisibility}
          >
            {showConfirmPassword ? (
              <IoEyeOffOutline size={18} />
            ) : (
              <IoEyeOutline size={18} />
            )}
          </span>
          {(newPassword!==confirmPassword && newPassword!=='' ) && <p className="text-red-500 text-[14px] text-end">Password Not Matched</p> }
          {(newPassword===confirmPassword && newPassword!=='') && <p className="text-green-600 text-[14px] text-end">Password Matched</p>}
        </div>
      </div>
      {/* Button */}
      <Button
      variant="outlined"
        className="!p-2  w-[90%] !border-none !capitalize  !text-white !btn_bg"
        onClick={handleChangePassword}
      >
        Save
      </Button>
     </div>
    </div>
  );
};

export default Password;
