import React, { useState } from "react";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { useParams, useNavigate } from "react-router-dom";
import { myImg } from '../assets/Images';
import axios from "axios";
import { toast } from "react-toastify";

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const { token } = useParams();
    const navigate = useNavigate();

    const handleReset = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        try {
            const res = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/doctors/reset-password`,
                { token, newPassword }
            );

            if (res.status === 200) {
                toast.success("Password reset successful!");
                navigate("/");
            }
        } catch (error) {
            toast.error(error?.response?.data?.error || "Invalid or expired link.");
        }
    };

    return (
        <div
            className="relative w-full h-screen bg-cover bg-center"
            style={{ backgroundImage: `url(${myImg.bgImage})` }}
        >
            <div className="flex items-center justify-center min-h-screen ">
                <div className="bg-white p-8  shadow-md w-full max-w-md">
                    <h2 className="text-2xl font-bold text-center mb-6">Reset Password</h2>
                    <form onSubmit={handleReset} className="space-y-5">
                        {/* New Password */}
                        <div>
                            <label className="block text-sm font-medium mb-2">New Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-4 py-2 border focus:outline-none focus:ring focus:ring-blue-300"
                                    placeholder="Enter new password"
                                    required
                                />
                                <span
                                    className="absolute right-3 top-3 cursor-pointer text-gray-500"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
                                </span>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Confirm Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-2 border focus:outline-none focus:ring focus:ring-blue-300"
                                    placeholder="Confirm new password"
                                    required
                                />
                                <span
                                    className="absolute right-3 top-3 cursor-pointer text-gray-500"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
                                </span>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-[#835AA6] text-white py-2  transition"
                        >
                            Reset Password
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
