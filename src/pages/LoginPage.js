//final code with responsive + Set Password flow
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { myImg } from "../assets/Images";
import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import axios from "axios";
import { Button } from "@mui/material";

const VIEWS = {
  LOGIN: "login",
  REQUEST_OTP: "requestOtp", 
  SET_PASSWORD: "setPassword",
};

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "",role:"" });

  // States to manage password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Set Password flow state ---
  const [view, setView] = useState(VIEWS.LOGIN);
  const [passwordNotSet, setPasswordNotSet] = useState(false); // shows the "Set Password" CTA after a failed login
  const [isRequestingOtp, setIsRequestingOtp] = useState(false);
  const [isSettingPassword, setIsSettingPassword] = useState(false);
  const [setPasswordData, setSetPasswordData] = useState({
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  //handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Reset the "set password" CTA if the user edits the form again
    if (passwordNotSet) setPasswordNotSet(false);
  };

  const handleSetPasswordChange = (e) => {
    const { name, value } = e.target;
    setSetPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!formData.role) {
      toast.error("Role is required");
      return false;
    }
    if (!formData.username) {
      toast.error("Username is required");
      return false;
    }
    if (!formData.password) {
      toast.error("Password is required");
      return false;
    }
    // Validate password (minimum 8 characters, at least one letter, one digit, and one special character)
    const passwordRegex =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      toast.error(
        "Password must be at least 8 characters long and include at least one letter, one digit, and one special character."
      );
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    setPasswordNotSet(false);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/doctors/login`,
        {
          email: formData.username,
          password: formData.password,
          userRole:formData.role,
        }
      );

      if (response.status === 200 && response.data.success) {
        toast.success(response.data.message || "OTP sent to your email");
        navigate("/verifyOtp", {
          replace: true,
          state: {
            email: formData.username,
            role: response.data.role,
          },
        });
      } else {
        toast.error("Unexpected response. Please try again.");
        setIsSubmitting(false);
      }
    } catch (error) {
      const errData = error?.response?.data;

      if (errData?.passwordNotSet) {
        setPasswordNotSet(true);
        toast.error(
          errData.error ||
            "No password has been set for this account yet. Please use 'Set Password' to create one."
        );
      } else {
        toast.error(errData?.error || "Login failed");
      }
      setIsSubmitting(false);
    }
  };

  const handleRequestSetPasswordOtp = async () => {
    if (!formData.username) {
      toast.error("Enter your email first");
      return;
    }

    setIsRequestingOtp(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/doctors/request-set-password-otp`,
        { email: formData.username }
      );

      toast.success(
        response.data.message || "OTP sent to your registered email"
      );
      setView(VIEWS.SET_PASSWORD);
    } catch (error) {
      toast.error(
        error?.response?.data?.error || "Failed to send OTP. Please try again."
      );
    } finally {
      setIsRequestingOtp(false);
    }
  };

  const handleSetPassword = async (e) => {
    e.preventDefault();

    const { otp, newPassword, confirmPassword } = setPasswordData;

    if (!otp || !newPassword || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setIsSettingPassword(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/doctors/set-password`,
        {
          email: formData.username,
          otp,
          password: newPassword,
          confirmPassword,
        }
      );

      toast.success(
        response.data.message || "Password set successfully. You can now log in."
      );

      setSetPasswordData({ otp: "", newPassword: "", confirmPassword: "" });
      setFormData((prev) => ({ ...prev, password: "" }));
      setPasswordNotSet(false);
      setView(VIEWS.LOGIN);
    } catch (error) {
      toast.error(error?.response?.data?.error || "Failed to set password");
    } finally {
      setIsSettingPassword(false);
    }
  };

  const handleResendOtp = () => {
    handleRequestSetPasswordOtp();
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  return (
    <>
      <div className="flex flex-col min-h-screen bg-gray-50">
        {/* Main Section */}
        <div className="grid md:grid-cols-2 items-center justify-start w-full min-h-[92vh] px-6 md:px-10 lg:px-20 py-3 gap-10 lg:gap-16">
          {/* Left Image Section (hidden on small screens) */}

          <div className="hidden md:flex items-center justify-center w-full">
            <div
              className="relative w-full overflow-hidden rounded-[32px] 
                        bg-gradient-to-br from-[#521785] via-[#64219A] to-[#3B0F61] 
                        shadow-2xl"
            >
              {/* Decorative circles */}
              <div
                className="absolute -top-24 -right-24 w-72 h-72 rounded-full 
                          bg-white/10"
              />

              <div
                className="absolute -bottom-28 -left-28 w-80 h-80 rounded-full 
                          bg-white/10"
              />

              <div
                className="absolute top-[45%] -right-20 w-52 h-52 rounded-full 
                          border border-white/10"
              />

              {/* Content */}
              <div className="relative z-10 flex flex-col h-full p-10 text-white">

                {/* Logo */}
                <div className="flex items-center justify-center mb-7">
                  <div
                    className="w-32 h-32 rounded-2xl bg-white flex items-center justify-center
                              shadow-xl p-2"
                  >
                    <img
                      src={myImg.krishnaLogo}
                      alt="Krishna Hospital"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                {/* Hospital Name */}
                <div className="text-center">
                  <h1 className="text-3xl font-bold tracking-wide">
                    Krishna Hospital
                  </h1>

                  <p className="mt-2 text-sm text-purple-100 tracking-wider">
                    Healthcare Management System
                  </p>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3 my-8">
                  <div className="h-px flex-1 bg-white/20" />

                  <div className="w-2 h-2 rounded-full bg-white/70" />

                  <div className="h-px flex-1 bg-white/20" />
                </div>

                {/* Tagline */}
                <div className="text-center">
                  <h2 className="text-2xl font-semibold leading-snug">
                    Compassionate Care,
                    <br />
                    Advanced Medicine
                  </h2>

                </div>

                <div className="mt-auto pt-8">
                  <div
                    className="rounded-xl bg-white/10 border border-white/10
                              px-5 py-4 text-center backdrop-blur-sm"
                  >

                    <p className="mt-1 text-sm font-medium">
                      Your Health, Our Priority
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <div className="w-full flex justify-center items-center">
            <div className="w-full bg-white rounded-2xl shadow-lg p-4 px-8 lg:px-14 lg:py-6 flex flex-col items-center">
              <div className="w-8 h-8 rounded-xl bg-[#F2E2FF] flex items-center justify-center mb-2" > 
                <span className="text-xl text-[#521785]">✦</span> 
              </div>
               <h2 className="text-2xl font-bold text-gray-800"> Welcome Back </h2>
              <p className="mt-1 text-gray-600 text-center text-sm sm:text-base">
                {view === VIEWS.LOGIN &&
                  "Hey, enter your details to sign in to your account"}
                {view === VIEWS.SET_PASSWORD &&
                  "Enter the OTP sent to your email and create a password"}
              </p>

              {/* Toggle Buttons - only on the login view */}
              {view === VIEWS.LOGIN && (
                <div className="flex items-center  gap-4 w-full mt-3 bg-[#F2E2FF] p-2 rounded-lg">
                  <Button className="!text-white !bg-[#521785] !capitalize !w-[50%] !py-1">
                    Login
                  </Button>
                  <Link to="/register" className="w-[50%]" style={{ width: "50%" }}>
                    <Button className="!text-[#343C6A] hover:!bg-[#521785] hover:!text-white hover:!w-[100%] !capitalize !w-[100%] !py-1">
                      Register
                    </Button>
                  </Link>
                </div>
              )}

              {view === VIEWS.LOGIN && (
                <form
                  className="mt-4 w-full flex flex-col gap-3"
                  onSubmit={handleSubmit}
                >

                  {/* Role */}
                  <div>
                    <label className="block text-[15px] font-semibold text-gray-700">
                      Role
                    </label>

                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full mt-1 px-4 py-1.5 border border-[#521785] rounded-lg
                                focus:outline-none focus:ring-1 focus:ring-[#521785]
                                bg-white"
                    >
                      <option value="">Select Role</option>
                      <option value="doctor">Doctor</option>
                      <option value="receptionist">Receptionist</option>
                      <option value="subDoctor">Sub Doctor</option>
                    </select>
                  </div>

                  {/* Username */}
                  <div>
                    <label className="block text-[15px] font-semibold text-gray-700">
                      Username
                    </label>
                    <input
                      type="email"
                      placeholder="Enter your username"
                      name="username"
                      className="w-full px-4 py-1.5 mt-1 border border-[#521785] rounded-lg 
                         focus:outline-none focus:ring-1 focus:ring-[#521785]"
                      value={formData.username}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-[15px] font-semibold text-gray-700">
                      Password
                    </label>
                    <div className="relative mt-1">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        name="password"
                        className="w-full px-4 py-1.5 border border-[#521785] rounded-lg 
                           focus:outline-none focus:ring-1 focus:ring-[#521785]"
                        value={formData.password}
                        onChange={handleChange}
                      />
                      <span
                        className="absolute top-3 right-3 cursor-pointer text-gray-500 hover:text-[#521785]"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? (
                          <IoEyeOffOutline size={20} />
                        ) : (
                          <IoEyeOutline size={20} />
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Set Password CTA - only shows after a failed login due to no password set */}
                  {passwordNotSet && (
                    <div className="-mt-2 flex items-center justify-between bg-[#FFF4E5] border border-[#F5C16C] rounded-lg px-3 py-2">
                      <span className="text-[13px] text-[#8A5300]">
                        No password set for this account yet.
                      </span>
                      <button
                        type="button"
                        disabled={isRequestingOtp}
                        onClick={handleRequestSetPasswordOtp}
                        className="text-[13px] font-semibold text-[#521785] hover:underline disabled:opacity-50 whitespace-nowrap ml-2"
                      >
                        {isRequestingOtp ? "Sending OTP..." : "Set Password"}
                      </button>
                    </div>
                  )}

                  {/* Remember me + Forgot Password */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-[14px] font-medium text-gray-700">
                      <input
                        type="checkbox"
                        id="rememberMe"
                        className="w-4 h-4 text-[#521785] border-gray-300 rounded focus:ring-[#521785]"
                      />
                      Remember Me
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-[14px] font-semibold text-[#521785] hover:underline"
                    >
                      Forgot Password?
                    </Link>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className={`!w-full !capitalize rounded-lg !py-2 !font-semibold !text-white !bg-[#521785] !transition 
              ${isSubmitting ? "!bg-gray-400 !cursor-not-allowed" : ""}`}
                  >
                    {isSubmitting ? "Sending OTP..." : "Login"}
                  </Button>
                </form>
              )}

              {view === VIEWS.SET_PASSWORD && (
                <form
                  className="mt-4 w-full flex flex-col gap-5"
                  onSubmit={handleSetPassword}
                >
                  {/* Email (read-only confirmation) */}
                  <div>
                    <label className="block text-[15px] font-semibold text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      disabled
                      className="w-full px-4 py-3 mt-2 border border-gray-300 bg-gray-100 rounded-lg text-gray-600"
                      value={formData.username}
                    />
                  </div>

                  {/* OTP */}
                  <div>
                    <label className="block text-[15px] font-semibold text-gray-700">
                      OTP
                    </label>
                    <input
                      type="text"
                      placeholder="Enter the 6-digit OTP"
                      name="otp"
                      maxLength={6}
                      className="w-full px-4 py-3 mt-2 border border-[#521785] rounded-lg 
                         focus:outline-none focus:ring-1 focus:ring-[#521785]"
                      value={setPasswordData.otp}
                      onChange={handleSetPasswordChange}
                    />
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-[15px] font-semibold text-gray-700">
                      New Password
                    </label>
                    <div className="relative mt-2">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        name="newPassword"
                        className="w-full px-4 py-3 border border-[#521785] rounded-lg 
                           focus:outline-none focus:ring-1 focus:ring-[#521785]"
                        value={setPasswordData.newPassword}
                        onChange={handleSetPasswordChange}
                      />
                      <span
                        className="absolute top-3 right-3 cursor-pointer text-gray-500 hover:text-[#521785]"
                        onClick={() => setShowNewPassword((prev) => !prev)}
                      >
                        {showNewPassword ? (
                          <IoEyeOffOutline size={20} />
                        ) : (
                          <IoEyeOutline size={20} />
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-[15px] font-semibold text-gray-700">
                      Confirm Password
                    </label>
                    <div className="relative mt-2">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Re-enter new password"
                        name="confirmPassword"
                        className="w-full px-4 py-3 border border-[#521785] rounded-lg 
                           focus:outline-none focus:ring-1 focus:ring-[#521785]"
                        value={setPasswordData.confirmPassword}
                        onChange={handleSetPasswordChange}
                      />
                      <span
                        className="absolute top-3 right-3 cursor-pointer text-gray-500 hover:text-[#521785]"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                      >
                        {showConfirmPassword ? (
                          <IoEyeOffOutline size={20} />
                        ) : (
                          <IoEyeOutline size={20} />
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[14px]">
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={isRequestingOtp}
                      className="font-semibold text-[#521785] hover:underline disabled:opacity-50"
                    >
                      {isRequestingOtp ? "Resending..." : "Resend OTP"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setView(VIEWS.LOGIN);
                        setSetPasswordData({
                          otp: "",
                          newPassword: "",
                          confirmPassword: "",
                        });
                      }}
                      className="font-semibold text-gray-500 hover:underline"
                    >
                      Back to Login
                    </button>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSettingPassword}
                    className={`!w-full !capitalize rounded-lg !py-3 !font-semibold !text-white !bg-[#521785] !transition 
              ${isSettingPassword ? "!bg-gray-400 !cursor-not-allowed" : ""}`}
                  >
                    {isSettingPassword ? "Setting Password..." : "Set Password"}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-center lg:justify-end px-4 py-2 text-xs sm:text-sm text-gray-600">
          <span>
            Designed & Developed by{" "}
            <a
              href="https://wesolutize.com/"
              target="_blank"
              className="underline text-blue-600 hover:text-blue-700"
            >
              NeoWeSolutize Technology
            </a>
            {" "}Pune
          </span>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
