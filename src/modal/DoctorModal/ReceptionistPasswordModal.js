import React, { useRef, useState } from "react";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import { RxCross2 } from "react-icons/rx";
import useModalClose from "../../hooks/useModalClose";
import { Button } from "@mui/material";
import apiClient from "../../api/apiClient";

const ReceptionistPasswordModal = ({
  receptionistId,
  setIsChangePassword,
  isChangePassword,
}) => {
  const modalRef = useRef();
  const handleClose = () => {
    setIsChangePassword(false);
  };
  useModalClose(modalRef, handleClose);
  // States to manage password visibility
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // States for form values
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  //validation for password
  const validatePasswords = () => {
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long");
      return false;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
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

  const handleChangePassword = async () => {
    if (!validatePasswords()) return;
    try {
      const response = await apiClient.post(
        `/api/receptionists/change-password/${receptionistId}`,
        {
          newPassword,
        }
      );

      if (response.status === 200) {
        toast.success("Password changed successfully");
        setNewPassword("");
        setConfirmPassword("");
        setIsChangePassword(false);
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "Failed to update password");
    }
  };

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50"
    >
      <div className="rounded-lg bg-white shadow-lg w-[90%] max-h-[90%]  xl:w-[50%] relative flex flex-col items-center object-cover">
        <div className="w-[100%] rounded-t-lg bg-[#521785]  p-2 pl-[5%] flex justify-start text-white items-center">
          <h1 className="text-xl text-left relative font-semibold">
            Change Password
          </h1>

          <RxCross2
            size={30}
            className="text-left cursor-pointer pl-2 absolute right-2"
            onClick={() => setIsChangePassword(!isChangePassword)}
          />
        </div>

        <div
          className="grid grid-cols-1 gap-2 mt-6  w-[70%] mb-4"
          style={{ gridTemplateColumns: "1fr" }}
        >
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
          </div>
        </div>

        <Button
          variant="outlined"
          onClick={handleChangePassword}
          className="!border-none !capitalize !text-white !btn_bg !mb-4 !w-[100px]"
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default ReceptionistPasswordModal;
