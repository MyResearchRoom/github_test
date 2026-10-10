import { useState, useRef, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { myImg } from "../assets/Images";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import TermsCondition from "./TermsCondition";
import { useAuth } from "../context/AuthContext";
import { DOCTOR } from "../Constants";

export default function OtpVerification() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const [isTermsAndCondition, setTermsAndCondition] = useState(false);
  const {login} = useAuth()
  const inputsRef = useRef([]);

  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || "";
  const role = location.state?.role || "";

  useEffect(() => {
    if (!email || !role) {
      navigate("/");
    }
  }, [email,role, navigate]);

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const joinedOtp = otp.join("");
    if (otp.includes("") || joinedOtp.length < 6) {
      toast.error("Please enter the complete 6-digit OTP");
      return;
    }

    try {
      setIsVerifying(true);
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/doctors/verifyOtp`,
        { email, otp: joinedOtp,userType:role }
      );

      if (response.status === 200) {
        const { token, role, hospitalId, acceptedTAndC } = response.data;

        toast.success("OTP Verified Successfully!");

        localStorage.removeItem("token");
        localStorage.removeItem("tempToken");

        if (role === DOCTOR && !Boolean(acceptedTAndC)) {
          console.log("acceptedTAndC",acceptedTAndC)
          localStorage.setItem("tempToken", token);
          localStorage.setItem("role", role);
          // localStorage.setItem("hospitalId", hospitalId);
          setTermsAndCondition(true);
        } else {
          // localStorage.setItem("token", token);
          // localStorage.setItem("role", role);
          // localStorage.setItem("hospitalId", hospitalId);
          login(token,role)
          navigate("/", { replace: true });
        }
      }
    } catch (error) {
      console.log("error",error);
      
      toast.error(
        error?.response?.data?.error || "Invalid OTP. Please try again."
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    // const email = localStorage.getItem("email");
    if (!email) {
      toast.error("Session expired. Please login again.");
      navigate("/");
      return;
    }

    try {
      setIsResending(true);

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/doctors/resendOtp`,
        { email }
      );

      if (response.status === 200) {
        setTimer(60);
        toast.success(response.data.message || "OTP resent successfully!");
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "Failed to resend OTP");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <>
      {isTermsAndCondition && localStorage.getItem("role") === DOCTOR && (
        <TermsCondition />
      )}
      <div className="flex flex-col min-h-screen bg-gray-50">
        {/* Main Section */}
        <div className="min-h-[90vh] flex items-center justify-center px-4 md:px-6 py-8 bg-[#F8F7FC]">

          <div className="w-full max-w-5xl grid md:grid-cols-2 bg-white rounded-[30px] shadow-xl overflow-hidden">

            {/* Left */}
            <div className="
              hidden md:flex
              relative
              items-center
              justify-center
              bg-gradient-to-br
              from-[#521785]
              via-[#64219A]
              to-[#3B0F61]
              p-12
              text-white
            ">

              <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/10" />
              <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-white/10" />

              <div className="relative text-center">

                <div className="w-28 h-28 mx-auto bg-white rounded-3xl p-4 shadow-xl">
                  <img
                    src={myImg.krishnaLogo}
                    alt="Krishna Hospital"
                    className="w-full h-full object-contain"
                  />
                </div>

                <h1 className="mt-7 text-3xl font-bold">
                  Krishna Hospital
                </h1>

                <p className="mt-2 text-purple-100">
                  Healthcare Management System
                </p>

                <div className="w-16 h-1 bg-white/60 rounded-full mx-auto my-7" />

                <p className="text-lg font-medium">
                  Secure. Reliable. Compassionate.
                </p>

                <p className="mt-3 text-sm text-purple-100 leading-6">
                  Access your hospital management portal
                  securely with OTP verification.
                </p>

              </div>
            </div>


            {/* Right */}
            <div className="flex items-center justify-center py-6 p-4 md:p-5 lg:p-7 sm:p-12">

              <div className="w-full max-w-sm">

                <div className="mb-7">

                  <p className="text-sm font-medium text-[#521785]">
                    ACCOUNT VERIFICATION
                  </p>

                  <h2 className="text-3xl font-bold text-gray-800 mt-2">
                    Verify OTP
                  </h2>

                  <p className="text-xs md:text-sm text-gray-500 mt-2 break-words">
                    Enter the 6-digit verification code sent to your registered email.
                  </p>

                </div>


                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-6"
                >

                  <div className="flex justify-between gap-2">
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => (inputsRef.current[idx] = el)}
                        type="text"
                        maxLength="1"
                        value={digit}
                        onChange={(e) =>
                          handleChange(e.target.value, idx)
                        }
                        onKeyDown={(e) =>
                          handleKeyDown(e, idx)
                        }
                        className="w-9 h-9
                          md:w-11 md:h-12
                          text-center
                          text-lg
                          font-semibold
                          rounded-xl
                          border border-gray-300
                          focus:outline-none
                          focus:border-[#521785]
                          focus:ring-2
                          focus:ring-[#521785]/10
                        "
                      />
                    ))}
                  </div>


                  <button
                    type="submit"
                    disabled={isVerifying}
                    className="
                      w-full py-1.5
                      md:py-3
                      rounded-xl
                      bg-[#521785]
                      text-white
                      font-semibold
                      hover:bg-[#43116d]
                      transition
                    "
                  >
                    
                    {isVerifying
                          ? "Verifying..."
                          : "Verify & Continue"}
                  </button>


                  <div className="text-center">

                    {timer > 0 ? (
                      <p className="text-sm text-gray-500">
                        Resend OTP in{" "}
                        <span className="font-semibold text-[#521785]">
                          {timer}s
                        </span>
                      </p>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={isResending}
                        className="text-sm font-semibold text-[#521785] hover:underline"
                      >
                        {isResending
                          ? "Resending..."
                          : "Resend OTP"}
                      </button>
                    )}

                  </div>


                  <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="
                      text-sm
                      text-gray-500
                      hover:text-[#521785]
                      transition
                    "
                  >
                    ← Back to Login
                  </button>

                </form>

              </div>
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
}
